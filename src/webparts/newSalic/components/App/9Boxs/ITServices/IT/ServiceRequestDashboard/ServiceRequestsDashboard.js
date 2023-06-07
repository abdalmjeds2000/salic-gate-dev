import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ServiceRequestsDashboard.css';
import { DownOutlined, HomeOutlined, TableOutlined, UserSwitchOutlined } from '@ant-design/icons';
import HistoryNavigation from '../../../../Global/HistoryNavigation/HistoryNavigation';
import { AppCtx } from '../../../../App';
import { Col, Row, Tree, Typography } from 'antd';
import Dashboard from './components/Dashboard/Dashboard';
import ServicesRequests from './components/ServicesRequests/ServicesRequests';
import GetSummaryByStatus from '../../API/GetSummaryByStatus';
import GetSummaryByPriority from '../../API/GetSummaryByPriority';
import GetSummaryByDepartment from '../../API/GetSummaryByDepartment';
import GetSummaryByRequestType from '../../API/GetSummaryByRequestType';
import Tabs from '../../../../Global/CustomTabs/Tabs';
import ToggleButton from '../../../../Global/ToggleButton';
import { TiFlowChildren } from 'react-icons/ti';
import ProtectRouteIT from '../../../../../Routers/ProtectRoutes/ProtectRouteIT';


function ServiceRequestsDashboard() {
  const { 
    user_data, 
    defualt_route, 
    summaryByStatus, setSummaryByStatus, 
    summaryByPriority, setSummaryByPriority, 
    summaryByDepartment, setSummaryByDepartment,
    summaryByRequestType, setSummaryByRequestType,
  } = useContext(AppCtx);
  
  const navigate = useNavigate();
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [servicesRequestsLoading, setServicesRequestsLoading] = useState(false);
  const [dataForUser, setDataForUser] = useState(null);


  useEffect(() => {
    if(Object.keys(user_data).length > 0) {
      setDataForUser({DisplayName: user_data?.Data?.DisplayName, Mail: user_data?.Data?.Mail});
    }
  }, [user_data]);

  const FetchData = async () => {
    setDashboardLoading(true);
    const _email = dataForUser.Mail || user_data.Data?.Mail;
    const _byStatus = await GetSummaryByStatus(_email);
    const _byPriority = await GetSummaryByPriority(_email);
    const _byDepartment = await GetSummaryByDepartment(_email);
    const _byRequestType = await GetSummaryByRequestType(_email);
    setSummaryByStatus(_byStatus.data.Data);
    setSummaryByPriority(_byPriority.data.Data);
    setSummaryByDepartment(_byDepartment.data.Data);
    setSummaryByRequestType(_byRequestType.data.Data);
    setDashboardLoading(false);
  }
  
  useEffect(() => {
    if( 
      Object.keys(user_data || {})?.length > 0 && 
      Object.keys(summaryByStatus || {})?.length === 0 && 
      Object.keys(summaryByPriority || {})?.length === 0 && 
      Object.keys(summaryByDepartment || {})?.length === 0 && 
      Object.keys(summaryByRequestType || {})?.length === 0 && 
      dataForUser 
    ) {
      FetchData()
    }
  }, [user_data]);
  
  useEffect(() => {
    if(Object.keys(user_data).length > 0 && dataForUser ) {
      FetchData();
    }
  }, [dataForUser]);

  const onSelect = (selectedKeys, info) => {
    setDataForUser(_ => {
      if(info.selectedNodes.length > 0) {
        return {...info.selectedNodes[0]}
      }
      return { ...{DisplayName: user_data?.Data?.DisplayName, Mail: user_data?.Data?.Mail}}
    })
  };

  const treeRef = useRef();
  const handleShowTree = (e) => {
    treeRef.current.style.display = 
    treeRef.current.style.display === "block" ? "none" : "block";

  }
  return (
    <ProtectRouteIT>
      <HistoryNavigation>
        <a onClick={() => navigate(`${defualt_route}/services-requests`)}>IT Service Center</a>
        <p>Service Requests Dashboard</p>
      </HistoryNavigation>


      <div className='standard-page service-requests-dashboard-container'>
        {
          user_data.Data?.DirectUsers?.length > 0 && <div className='employees-tree'>
            <Row justify="space-between" align="middle" style={{marginBottom: '10px'}}>
              <Col>
                <Typography.Text strong style={{display: 'block', fontSize: '1rem'}}>
                  <UserSwitchOutlined /> Select Employee
                </Typography.Text>
              </Col>
              <Col>
                <span className='expand-tree-btn'>
                  <ToggleButton
                    icon={<TiFlowChildren />}
                    title="Show Employees Tree"
                    btnSize="small"
                    callback={handleShowTree}
                  />
                </span>
              </Col>
            </Row>
            <div className='tree-container' ref={treeRef}>
              <Tree
                showLine
                showIcon
                defaultExpandedKeys={[user_data?.Data?.DirectUsers[0]?.Mail]}
                switcherIcon={<DownOutlined />}
                onSelect={onSelect}
                treeData={[user_data.Data]}
                fieldNames={{ title: "DisplayName", key: "Mail", children: "DirectUsers"  }}
              />
            </div>
          </div>
        }
        <Tabs 
          items={[
            {
              key: 1, 
              icon: <HomeOutlined />, 
              title: 'Dashboard', 
              content: <Dashboard loading={dashboardLoading} DataForUser={dataForUser} summaryByStatus={summaryByStatus} summaryByPriority={summaryByPriority} summaryByDepartment={summaryByDepartment} summaryByRequestType={summaryByRequestType} />,
              loading: dashboardLoading
            },
            {
              key: 2, 
              icon: <TableOutlined />, 
              title: 'Service Requests', 
              content: dataForUser ? <ServicesRequests dataForUser={dataForUser} loading={servicesRequestsLoading} setLoading={setServicesRequestsLoading} /> : null,
              loading: servicesRequestsLoading
            },
          ]}
        />
      </div>
    </ProtectRouteIT>
  )
}

export default ServiceRequestsDashboard