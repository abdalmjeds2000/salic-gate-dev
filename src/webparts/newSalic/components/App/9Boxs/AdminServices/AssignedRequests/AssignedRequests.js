import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppCtx } from '../../../App'
import HistoryNavigation from '../../../Global/HistoryNavigation/HistoryNavigation';
import { Button, message, Table } from 'antd';
import GetAssignedRequests from './GetAssignedRequests'
import AntdLoader from '../../../Global/AntdLoader/AntdLoader';
import UserColumnInTable from '../../../Global/UserColumnInTable/UserColumnInTable';
import moment from 'moment';



function AssignedRequests() {
  const { admin_assigned_requests, setAdminAssignedRequests, defualt_route, user_data } = useContext(AppCtx);
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  

  async function fetchData() {
    setLoading(true)
    const response = await GetAssignedRequests(user_data?.Data?.Mail);
    if(response.status === 200){
      const dataTable = response?.data?.Data?.map((row, i) => {
        row.Key = i+1
        return {...row}
      })
      setAdminAssignedRequests(dataTable);
    } else {
      message.error("Failed Load Data!");
    }
    setLoading(false);
  }

  useEffect(() => {
    if(Object.keys(user_data).length > 0/*  && admin_assigned_requests.length === 0 */){
      fetchData();
    }
  }, [user_data])

  const ToUpdatePage = (RequestType, RequestId) => {
    const Code = RequestType.split("-")[0];
    if(Code === "VISA") {
      navigate(defualt_route + `/admin-services/issuing-VISA/${RequestId}`);
    } else if(Code === "BG") {
      navigate(defualt_route + `/admin-services/business-gate/${RequestId}`);
    } else if(Code === "SHP") {
      navigate(defualt_route + `/admin-services/shipment/${RequestId}`);
    } else if(Code === "SUP") {
      navigate(defualt_route + `/admin-services/office-supply/${RequestId}`);
    } else if(Code === "MAN") {
      navigate(defualt_route + `/admin-services/maintenance/${RequestId}`);
    } else if(Code === "VIS") {
      navigate(defualt_route + `/admin-services/visitor/${RequestId}`);
    } else if(Code === "TS") {
      navigate(defualt_route + `/admin-services/transportation/${RequestId}`);
    }
    return null
  }

  const columns = [
    {
      title: '#',
      dataIndex: 'Key',
    },{
      title: 'Application Name',
      dataIndex: 'ApplicationName',
      render: (name, record) => <a onClick={() => ToUpdatePage(record.ReferenceCode, record.Id)}>{name}</a>
    },{
      title: 'Created',
      dataIndex: 'CreatedAt',
      render: (val) => val ? moment(val).format('MM/DD/YYYY hh:mm') : ' - '
    },{
      title: 'Ref. Code',
      dataIndex: 'ReferenceCode',
      render: (code, record) => (
        <div style={{ minWidth: 160 }}>
          <a onClick={() => ToUpdatePage(code, record.Id)}>
            {
              record?.Status !== "FIN" && moment(moment()).diff(record.CreatedAt, 'days') >= 2
                ? <span style={{ userSelect: "none", fontSize: "2.5rem", lineHeight: 0, position: "relative", top: 7, color: "var(--brand-orange-color)"}}>•</span>
                : null
            }
            {code}
          </a>
        </div>
      )
    },{
      title: 'Requester',
      dataIndex: 'ByUser',
      render: (val) => val ? <UserColumnInTable Mail={val?.Mail} DisplayName={val?.DisplayName} /> : '-'
    },{
      title: 'By',
      dataIndex: 'ToUser',
      render: (val) => val ? <UserColumnInTable Mail={val?.Mail} DisplayName={val?.DisplayName} /> : '-'
    },{
      title: 'Status',
      dataIndex: 'Status',
      render: (val) => <><span style={{ fontSize: '2.5rem', lineHeight: 0, position: 'relative', top: '7px', color: val === 'FIN' ? 'rgb(39, 124, 98)' : 'rgb(233 155 77)'}}>•</span>{val === "FIN" ? "Completed" : "Processing"}</>
    }
  ];




  return (
    <>
      <HistoryNavigation>
        <a onClick={() => navigate(`${defualt_route}/admin-services`)}>Admin Service</a>
        <p>Assigned Requests</p>
      </HistoryNavigation>

      <div className='table-page-container'>

        <div className='content'>
          <div className="header">
            <h1>Assigned Requests</h1>
            <Button type='primary' size='small' onClick={fetchData}>Refresh</Button>
          </div>

          <div className='form'>
            {
              !loading
              ? <Table
                  columns={columns}
                  dataSource={admin_assigned_requests}
                  pagination={{position: ['none', 'bottomCenter'], pageSize: 50, hideOnSinglePage: true }} 
                />
              : <AntdLoader />
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default AssignedRequests