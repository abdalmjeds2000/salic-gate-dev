import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppCtx } from '../../../App';
import { Button, Input, Space, Tag } from 'antd';
import { ClockCircleOutlined, PlusOutlined, RedoOutlined } from '@ant-design/icons';
import HistoryNavigation from '../../../Global/HistoryNavigation/HistoryNavigation';
import RequestsTable from '../../../Global/RequestsComponents/RequestsTable';
import UserColumnInTable from '../../../Global/UserColumnInTable/UserColumnInTable';
import GetAllResearchRequests from '../API/GetAllResearchRequests';
import StatusTag from '../../../Global/RequestsComponents/StatusTag';
import ProtectRouteResearch from '../../../../Routers/ProtectRoutes/ProtectRouteResearch';

function AllResearchRequests() {
  const { defualt_route, user_data, research_requests_data, setResearchRequestsData } = useContext(AppCtx);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);


  async function GetRequests() {
    setLoading(true);
    const response = await GetAllResearchRequests();
    if(response) {
      setResearchRequestsData(response);
    } else {
      console.log("ERROR :: Get Content Requests");
    }
    setLoading(false);
  } 
  useEffect(() => {
    if(Object.keys(user_data).length > 0 && research_requests_data?.length === 0) {
      GetRequests();
    }
  }, [user_data]);

  const columns = [
    {
      title: 'RR[#]',
      dataIndex: 'Id',
      width: '3%',
      render: (val) => <b>{`RR[#${val}]`}</b>
    },{
      title: 'Date & Time',
      dataIndex: 'Created',
      width: '12%',
      render: (val) => val ? new Date(val).toLocaleString() : ' - '
    },{
      title: 'Subject',
      dataIndex: 'Title',
      width: '30%',
      render: (val, record) => <a onClick={() => navigate(defualt_route + `/research-requests/${record.Id}`)}>{val}</a>
    },{
      title: 'Timeline',
      dataIndex: 'Timeline',
      width: '15%',
      render: (val) => <Tag icon={<ClockCircleOutlined />} color="default">{new Date(val).toLocaleDateString()}</Tag>
    },{
      title: 'Requester',
      dataIndex: 'Author',
      width: '15%',
      render: (val) => <UserColumnInTable Mail={val?.EMail} DisplayName={val?.Title} />
    },{
      title: 'Pending With',
      dataIndex: 'PendingWith',
      width: '15%',
      render: (val, record) => record.Status === "Submitted" ? <UserColumnInTable Mail={val?.EMail} DisplayName={val?.Title} /> : ' - '
    },{
      title: 'Status',
      dataIndex: 'Status',
      width: '10%',
      render: (val) =>  <StatusTag Status={val} />
    }
  ];


  const ControlPanel = (
    <Space direction='horizontal'>
      {/* <Input size='small' placeholder='Type To Search' onChange={e => setSearchText(e.target.value)} /> */}
      <Button type='primary' size='small' onClick={GetRequests}><RedoOutlined /> Refresh</Button>
      <Button size='small' onClick={() => navigate(defualt_route+'/research-requests/new-request')}><PlusOutlined /> New Request</Button>
    </Space>
  )

  return (
    <ProtectRouteResearch>
      <HistoryNavigation>
        <a onClick={() => navigate(`${defualt_route}/research-requests`)}>Research Requests</a>
        <p>Research Request</p>
      </HistoryNavigation>

      <RequestsTable
        Title="Research Requests"
        IsMyRequest={false}
        HeaderControlPanel={ControlPanel}
        IsLoading={loading}
        Columns={columns}
        DataTable={research_requests_data}
      />
    </ProtectRouteResearch>
    
  )
}

export default AllResearchRequests