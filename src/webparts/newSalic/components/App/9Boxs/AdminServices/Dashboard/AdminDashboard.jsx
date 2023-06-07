import React, { useContext, useEffect, useState } from 'react';
import "./AdminDashboard.css";
import { Col, Row, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { AppCtx } from '../../../App';
import HistoryNavigation from '../../../Global/HistoryNavigation/HistoryNavigation';
import Employees from './components/Employees/Employees';
import Overview from './components/Overview';
import LatestRequests from './components/LatestRequests';
import RequestsDetails from './components/RequestsDetails';
import UserRequests from './components/UserRequests';
import axios from 'axios';
import moment from 'moment';
import ProtectAdminDashboard from '../../../../Routers/ProtectRoutes/ProtectAdminDashboard';



const initialSelectedRequests = ["VISA", "Business Gate", "Shipment Request", "Office Supply", "Maintenance Request", "Visitor VISA", "Transportation Gate"];

// Get today's date
const today = new Date();
// Get the date 30 days ago
const last30Days = new Date(today);
last30Days.setDate(today.getDate() - 30);



const AdminDashboard = () => {
  const { defualt_route } = useContext(AppCtx);
  const navigate = useNavigate();
  const [dataFor, setDataFor] = useState({});

  const [latestRequestsData, setLatestRequestsData] = useState([]);
  const [requestsDetailsData, setRequestsDetailsData] = useState([]);
  const [userRequestsCounts, setUserRequestsCounts] = useState({});
  const [overviewData, setOverviewData] = useState([]);
  const [selectdRequests, setSelectdRequests] = useState(initialSelectedRequests);
  const [overviewRangeDates, setOverviewRangeDates] = useState({});
  
  const fetchRequestsDetails = async (signal) => {
    const response = await axios.get("https://dev.salic.com/api/AdminServices/Summary", { signal: signal });
    if(response?.status == 200) {
      setRequestsDetailsData(response.data)
    }
  }
  const fetchLatestRequests = async (user, signal) => {
    const response = await axios.get(`https://dev.salic.com/api/Processes/Get?Email=${user.Mail}&start=0&query=${selectdRequests.join(",")}`, { signal: signal });
    if(response?.data?.Status == 200) {
      setLatestRequestsData(response.data.Data)
    }
  }
  const fetchOverviewData = async (user, signal) => {
    const response = await axios.get(`https://dev.salic.com/api/AdminServices/SummaryBy?Email=${user.Mail}&FromDate=${moment(overviewRangeDates.from || today).format("MM/DD/YYYY")}&ToDate=${moment(overviewRangeDates.to || last30Days).format("MM/DD/YYYY")}`, { signal: signal });
    if(response.status == 200) {
      setOverviewData(response.data)
    }
  }
  // called when selcted user change
  const onChangeUser = (user) => {
    setDataFor(user);
  }

  // fetch latest requests
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    if(Object.keys(dataFor).length > 0) fetchLatestRequests(dataFor, signal);
    return () => {controller.abort();};
  }, [dataFor, selectdRequests]);
  // fetch requests details
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    fetchRequestsDetails(signal);
    return () => {controller.abort();};
  }, []);
  // fetch overview data
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    if(Object.keys(dataFor).length > 0) fetchOverviewData(dataFor, signal);
    return () => {controller.abort();};
  }, [dataFor, overviewRangeDates]);


  // update selected requests types in right of page.
  const handleToggleRequests = (name) => {
    const isExist = selectdRequests.filter(item => item === name).length > 0;
    if(isExist) {
      const newArr = selectdRequests.filter(item => item !== name);
      setSelectdRequests(newArr);
    } else {
      setSelectdRequests(prev => [...prev, name]);
    }
  }

  // update user counts: closed, delayed and pending.
  useEffect(() => {
    const getUserRequestsCounts = () => {
      const requests = latestRequestsData;
      const closedRequests = requests.filter(item => item.Status === "FIN");
      const delayedRequests = requests.filter(item => item.Status !== "FIN" && moment(moment()).diff(item.CreatedAt, 'days') >= 2);
      const pendingRequests = requests.filter(item => item.Status !== "FIN");
      return ({ Closed: closedRequests.length, Delayed: delayedRequests.length, Pending: pendingRequests.length })
    }
    setUserRequestsCounts(getUserRequestsCounts);
  }, [latestRequestsData])


  const onDateChange = (momentDates) => {
    setOverviewRangeDates({ from: momentDates[0], to: momentDates[1]})
  };

  return (
    <ProtectAdminDashboard>
      <HistoryNavigation>
        <a onClick={() => navigate(defualt_route + "/admin-services")}>Admin Services Center</a>
        <p>Admin Dashboard</p>
      </HistoryNavigation>

      <div className='standard-page'>
        <div className='admin-dashboard-container'>
          <div className='header'>
            <div>
              <Typography.Text strong style={{fontSize: "1.5rem"}}>Admin Services Dashboard</Typography.Text>
            </div>
            <div></div>
          </div>

          <div className='main'>
            <Row gutter={[25, 25]}>
              <Col xs={24} lg={16}>
                <Row gutter={[25, 25]}>
                  <Col span={24}><Employees onChangeUser={(user, signal) => onChangeUser(user, signal)} /></Col>
                  <Col span={24}><UserRequests {...userRequestsCounts} /></Col>
                  <Col span={24}><Overview data={overviewData} onDateChange={onDateChange} /></Col>
                </Row>
              </Col>
              <Col xs={24} lg={8}>
                <RequestsDetails data={requestsDetailsData} selectdRequests={selectdRequests} toggleSelect={handleToggleRequests} />
              </Col>
              <Col span={24}>
                <LatestRequests data={latestRequestsData} />
              </Col>
            </Row>
          </div>

          <div className='footer'></div>
        </div>
      </div>
    </ProtectAdminDashboard>
  )
}

export default AdminDashboard