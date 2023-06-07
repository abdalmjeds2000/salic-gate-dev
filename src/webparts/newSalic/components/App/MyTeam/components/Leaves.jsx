import React from 'react';
import { Table, Tag } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, SyncOutlined } from '@ant-design/icons';
import moment from 'moment';

const Leaves = () => {


  const columns = [
    { title: 'From', dataIndex: 'from', width: '20%', render: (val) => moment(val).format('MM/DD/YYYY') },
    { title: 'To', dataIndex: 'to', width: '20%', render: (val) => moment(val).format('MM/DD/YYYY') },
    { title: 'Days', dataIndex: 'days', width: '20%', render: (val) => `${val} Days` },
    { title: 'Status', dataIndex: 'status', width: '20%', render: (val) => {
        if(val === "Approved") {
          return <Tag icon={<CheckCircleOutlined />} color="success">Approved</Tag>
        }else if(val === "Rejected") {
          return <Tag icon={<CloseCircleOutlined />} color="error">Rejected</Tag>
        } else {
          return <Tag icon={<SyncOutlined spin />} color="processing">Pending</Tag>
        }
      }
    },
    { title: 'Type', dataIndex: 'type', width: '20%' },
  ];

  const data = [
    {from: new Date(), to: new Date(), days: 4, status: 'Pending', type: 'Vacation Type'},
    {from: new Date(), to: new Date(), days: 4, status: 'Pending', type: 'Vacation Type'},
    {from: new Date(), to: new Date(), days: 4, status: 'Approved', type: 'Vacation Type'},
    {from: new Date(), to: new Date(), days: 4, status: 'Approved', type: 'Vacation Type'},
    {from: new Date(), to: new Date(), days: 4, status: 'Rejected', type: 'Vacation Type'},
    {from: new Date(), to: new Date(), days: 4, status: 'Rejected', type: 'Vacation Type'},
    {from: new Date(), to: new Date(), days: 4, status: 'Approved', type: 'Vacation Type'},
    {from: new Date(), to: new Date(), days: 4, status: 'Rejected', type: 'Vacation Type'},
    {from: new Date(), to: new Date(), days: 4, status: 'Pending', type: 'Vacation Type'},
    {from: new Date(), to: new Date(), days: 4, status: 'Rejected', type: 'Vacation Type'},
    {from: new Date(), to: new Date(), days: 4, status: 'Approved', type: 'Vacation Type'},
    {from: new Date(), to: new Date(), days: 4, status: 'Rejected', type: 'Vacation Type'},
    {from: new Date(), to: new Date(), days: 4, status: 'Approved', type: 'Vacation Type'},
    {from: new Date(), to: new Date(), days: 4, status: 'Approved', type: 'Vacation Type'},
    {from: new Date(), to: new Date(), days: 4, status: 'Approved', type: 'Vacation Type'},
    {from: new Date(), to: new Date(), days: 4, status: 'Rejected', type: 'Vacation Type'},
  ];

  
  return (
    <div style={{overflowX: 'auto'}}>
      <Table
        columns={columns} 
        dataSource={data}
        pagination={false}
      />
    </div>
  )
}

export default Leaves