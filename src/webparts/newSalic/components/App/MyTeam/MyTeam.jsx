import React, { useState } from 'react';
import HistoryNavigation from '../Global/HistoryNavigation/HistoryNavigation';
import TeamTree from './components/TeamTree/TeamTree';
import Information from './components/Information/Information';
import Attendance from './components/Attendance/Attendance';
import KPIProgress from './components/Performance/KPIProgress';
import UserCalendar from './components/Calendar/UserCalendar';
import Tabs from '../Global/CustomTabs/Tabs';
import { Col, Row } from 'antd';
import { AreaChartOutlined, CalendarOutlined, CheckSquareOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';


const MyTeam = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [performanceData, setPerformanceData] = useState({});
  const [yearsPerformanceData, setYearsPerformanceData] = useState([]);
  const [latestLeaves, setLatestLeaves] = useState([]);
  const [dataFor, setDataFor] = useState({});
  const [loading, setLoading] = useState(false);
  

  const fetchData = async (user, signal) => {
    setLoading(true);

    /* fetch attendance of user ( last month ) */
    axios({
      method: 'GET',
      url: `https://dev.salic.com/api/attendance/GetByEmail?Email=-1,${user?.Mail}&startDate=&EndDate=&month=${new Date().getMonth() + 1}&year=${new Date().getYear() + 1900}`,
      signal: signal
    }).then((res) => {
      setAttendanceData(res.data.Data);
    }).catch((err) => {
      console.log(err); 
    });
    
    /* fetch kpi performance of user */
    axios({
      method: 'GET',
      url: `https://dev.salic.com/api/Integration/gate_statisiics?PIN=${user?.PIN}`,
      signal: signal
    }).then((res) => {
      setPerformanceData(res.data);
    }).catch((err) => {
      console.log(err); 
    })
    /* fetch performance of years */
    axios({
      method: 'GET',
      url: `https://dev.salic.com/api/User/performance?Email=${user?.Mail}`,
      signal: signal
    }).then((res) => {
      setYearsPerformanceData(res.data);
    }).catch((err) => {
      console.log(err); 
    })

    /* fetch latest leaves data (always return 5 rows) */
    axios({
      method: 'GET',
      url: `https://dev.salic.com/api/User/latest_leaves?Email=${user?.Mail}`,
      signal: signal
    }).then((res) => {
      setLatestLeaves(res.data);
    }).catch((err) => {
      console.log(err); 
    })

    setLoading(false);
  }

  const onChangeUser = (user, signal) => {
    if(user) {
      fetchData(user, signal);
    }
  }

  const tabsItems = [
    {
      key: 1, 
      icon: <UserOutlined />, 
      title: 'Information', 
      content: <Information userData={dataFor} yearsPerformanceData={yearsPerformanceData} performanceData={performanceData} latestLeavesData={latestLeaves} />
    },{
      key: 2, 
      icon: <CheckSquareOutlined />, 
      title: 'Attendance', 
      content: <Attendance data={attendanceData} />
    },{
      key: 3, 
      icon: <AreaChartOutlined />, 
      title: 'KPI Progress', 
      content: <KPIProgress total={performanceData?.performace?.count} kpiItems={performanceData?.performace?.data} userData={dataFor} />
    },{
      key: 4, 
      icon: <CalendarOutlined />, 
      title: 'Calendar', 
      content: <UserCalendar userData={dataFor} />
    },
  ];


  return (
    <>
      <HistoryNavigation>
        <p>My Team</p>
      </HistoryNavigation>

      <div className='standard-page my-team-page'>
        <Row gutter={[12, 12]}>
          <Col span={24}>
            <TeamTree onChangeUser={(user, signal) => {
              onChangeUser(user, signal); 
              setDataFor(user);
            }} />
          </Col>

          <Col span={24}>
            <Tabs items={tabsItems} loading={loading} />
          </Col>
        </Row>
      </div>
    </>
  )
}

export default MyTeam