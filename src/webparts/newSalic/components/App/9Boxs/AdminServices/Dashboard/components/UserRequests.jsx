import React from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import { FileDoneOutlined, FileSyncOutlined, SyncOutlined } from '@ant-design/icons';



const StatCard = ({ color, title, icon, value }) => (
  <Card style={{ backgroundColor: "#f5f5f5", borderBottom: `5px solid ${color}`, overflow: "hidden" }}>
    <Statistic
      title={title}
      value={value}
      prefix={<span style={{ color: color }}>{icon}</span>}
      valueStyle={{ fontWeight: 700, fontSize: '2rem' }}
    />
    <span style={{position: "absolute", right: "-15px", top: "-10px", fontSize: "5rem", color: color, opacity: 0.05}}>
      {icon}
    </span>
  </Card>
);


const UserRequests = ({ Closed, Delayed, Pending }) => {
  const cardsInfo = [
    { title: "Closed", color: "#1bb87e", icon: <FileDoneOutlined />, count: Closed },
    { title: "Delayed", color: "#379bd1", icon: <FileSyncOutlined />, count: Delayed },
    { title: "Pending", color: "#ffc823", icon: <SyncOutlined />, count: Pending },
  ];
  const cardsRender = cardsInfo.map((item, i) => (
    <Col key={i} xs={24} md={8}>
      <StatCard 
        title={item.title}
        color={item.color}
        icon={item.icon}
        value={item.count}
      />
    </Col>
  ));

  return (
    <Row gutter={[25, 25]}>
      {cardsRender}
    </Row>
  )
}

export default UserRequests