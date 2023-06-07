import React, { useContext, useEffect, useState } from 'react'
import { Button, Input, Space } from 'antd';
import { PlusOutlined, RedoOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom';
import HistoryNavigation from '../../Global/HistoryNavigation/HistoryNavigation';
import UserColumnInTable from '../../Global/UserColumnInTable/UserColumnInTable'
import { AppCtx } from '../../App';
import GetAllContentRequests from '../API/GetAllContentRequests';
import StatusTag from '../../Global/RequestsComponents/StatusTag';
import RequestsTable from '../../Global/RequestsComponents/RequestsTable';
import ProtectRouteContent from '../../../Routers/ProtectRoutes/ProtectRouteContent';

function AllContentRequests() {
  const { content_requests_data, setContentRequestsData, user_data, defualt_route } = useContext(AppCtx);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);


  async function GetRequests() {
    setLoading(true);
    const response = await GetAllContentRequests();
    if(response) {
      setContentRequestsData(response);
    } else {
      console.log("ERROR :: Get Content Requests");
    }
    setLoading(false);
  } 
  useEffect(() => {
    if(Object.keys(user_data).length > 0 && content_requests_data.length === 0) {
      GetRequests();
    }
  }, [user_data]);

  const columns = [
    {
      title: 'CR[#]',
      dataIndex: 'Id',
      width: '3%',
      render: (val) => <b>{`CR[#${val}]`}</b>
    },{
      title: 'Date & Time',
      dataIndex: 'Created',
      width: '17%',
      render: (val) => val ? new Date(val).toLocaleString() : ' - '
    },{
      title: 'Subject',
      dataIndex: 'Title',
      width: '30%',
      render: (val, record) => <a onClick={() => navigate(defualt_route + `/content-requests/${record.Id}`)}>{val}</a>
    },{
      title: 'Requester',
      dataIndex: 'Author',
      width: '20%',
      render: (val) => <UserColumnInTable Mail={val?.EMail} DisplayName={val?.Title} />
    },{
      title: 'Pending With',
      dataIndex: 'PendingWith',
      width: '20%',
      render: (val, record) => record.Status === "Submitted" ? <UserColumnInTable Mail={val?.EMail} DisplayName={val?.Title} /> : ' - '
    },{
      title: 'Status',
      dataIndex: 'Status',
      width: '10%',
      render: (val) => <StatusTag Status={val} />
    }
  ];

  const ControlPanel = (
    <Space direction='horizontal'>
      <Button type='primary' size='small' onClick={GetRequests}><RedoOutlined /> Refresh</Button>
      <Button size='small' onClick={() => navigate(defualt_route+'/content-requests/new-request')}><PlusOutlined /> New Request</Button>
    </Space>
  )




  return (
    <ProtectRouteContent>
      <HistoryNavigation>
        <a onClick={() => navigate(`${defualt_route}/content-requests`)}>Content Requests</a>
        <p>Content Requests</p>
      </HistoryNavigation>

      <RequestsTable
        Title="Content Requests"
        IsMyRequest={false}
        HeaderControlPanel={ControlPanel}
        IsLoading={loading}
        Columns={columns}
        DataTable={content_requests_data}
      />
    </ProtectRouteContent>
  )
}

export default AllContentRequests