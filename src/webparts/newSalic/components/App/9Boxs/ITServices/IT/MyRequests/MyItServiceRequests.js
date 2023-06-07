import React, { useContext, useEffect, useState } from 'react';
import { Button, Input, Space, Tag, Typography } from 'antd';
import { InfoCircleOutlined, PlusOutlined, RedoOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import HistoryNavigation from '../../../../Global/HistoryNavigation/HistoryNavigation';
import UserColumnInTable from '../../../../Global/UserColumnInTable/UserColumnInTable';
import { AppCtx } from '../../../../App';
import GetMyItServiceRequests from '../../API/GetMyItServiceRequests';
import RequestsTable from '../../../../Global/RequestsComponents/RequestsTable';
import moment from 'moment';

function MyItServiceRequests() {
  const { my_it_requests_data, setMyItRequestsData, user_data, defualt_route } = useContext(AppCtx);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function GetRequests() {
    setLoading(true);
    const response = await GetMyItServiceRequests(user_data.Data?.Mail);
    if(response) {
      setMyItRequestsData(response.data.Data);
    } else {
      console.log("ERROR :: Get My It Requests");
    }
    setLoading(false);
  } 
  useEffect(() => {
    if(Object.keys(user_data).length > 0/*  && my_it_requests_data?.length === 0 */) {
      GetRequests();
    }
  }, [user_data]);

  const columns = [
    {
      title: 'SR. #',
      dataIndex: 'Id',
      width: '5%',
      render: (val) => <b>{`SR[#${val}]`}</b>
    },{
      title: 'Date & Time',
      dataIndex: 'CreatedAt',
      width: '12%',
      render: (val) => <div style={{minWidth: 120}}>{moment(val).format('MM/DD/YYYY hh:mm:ss')}</div>
    },{
      title: 'Subject',
      dataIndex: 'Subject',
      width: '33%',
      render: (val, record) => (
        <div style={{minWidth: 250}}>
          <Space direction='horizontal'>
            <InfoCircleOutlined style={{color: record.Priority === "1" ? "#0c508c" : "#ff272b"}} /> 
            <Typography.Link onClick={() => navigate(defualt_route + `/services-requests/${record.Id}`)}>{val}</Typography.Link>
          </Space>
        </div>
      )
    },{
      title: 'Requester',
      dataIndex: 'Requester',
      width: '16%',
      render: (val) => <div style={{minWidth: 100}}><UserColumnInTable Mail={val?.Mail} DisplayName={val?.DisplayName} /></div>
    },{
      title: 'Pending With',
      dataIndex: 'PendingWith',
      width: '16%',
      render: (val) => val ? <div style={{minWidth: 100}}><UserColumnInTable Mail={val?.Mail} DisplayName={val?.DisplayName} /></div> : '-'
    },{
      title: 'Status',
      dataIndex: 'Status',
      width: '8%',
      render: (val) => <div style={{minWidth: 80}}>{val}</div>
    },{
      title: 'Request Type',
      dataIndex: 'RequestType',
      width: '10%',
      render: (val) => <div style={{minWidth: 80}}>{val}</div>
    }
  ];


  const ControlPanel = (
    <Space direction='horizontal'>
      <Button type='primary' size='small' onClick={GetRequests}><RedoOutlined /> Refresh</Button>
      <Button size='small' onClick={() => navigate(defualt_route+'/services-requests/services-request')}><PlusOutlined /> New Request</Button>
    </Space>
  )
  
  return (
    <>
      <HistoryNavigation>
        <a onClick={() => navigate(`${defualt_route}/services-requests`)}>IT Services Center</a>
        <p>My IT Sevices Requests</p>
      </HistoryNavigation>

      <RequestsTable
        Title="My Requests"
        HeaderControlPanel={ControlPanel}
        IsLoading={loading}
        Columns={columns}
        DataTable={my_it_requests_data}
        rowClassName={(record, index) => (
          record.Status === "PROCESSING"
            ? "PROCESSING"
          : record.Status === "Waiting For Approval"
            ? "Waiting_For_Approval"
          : record.Status === "SUBMITTED"
            ? "SUBMITTED"
          : ""
        )}
      />
    </>
  )
}

export default MyItServiceRequests