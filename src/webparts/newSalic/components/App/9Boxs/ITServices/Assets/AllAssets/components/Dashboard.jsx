import React, { useContext, useEffect, useState } from 'react';
import { Card, Col, message, Row, Select, Statistic, Typography } from 'antd';
import LineChart from '../../../../../Global/CustomLineChart/LineChart';
import axios from 'axios';
import { AppCtx } from '../../../../../App';
import AntdLoader from '../../../../../Global/AntdLoader/AntdLoader';
import { ApiOutlined, MailOutlined } from '@ant-design/icons';

const Dashboard = () => {
  const { user_data } = useContext(AppCtx);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [dataBy, setDataBy] = useState("Type");

  const FetchData = async (mail) => {
    setLoading(true);
    axios({
      method: 'GET',
      url: `https://dev.salic.com/api/Asset/Dashboard?Email=${mail}`,
    }).then((response) => {
      setData(response.data.Data);
    }).catch(() => {
      message.error('Failed, check your network and try again.', 3)
    })
    setLoading(false);
  }


  useEffect(() => {
    if(Object.keys(user_data).length > 0 && data.length === 0) {
      FetchData(user_data.Data?.Mail);
    }
  }, [user_data])
  


  const CardTitle = (
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap'}}>
      <Typography.Text strong style={{fontSize: '1.2rem'}}>SALIC's Assets By</Typography.Text>
      <Select
        defaultValue="Type"
        bordered={false}
        value={dataBy}
        style={{width: 125}}
        dropdownMatchSelectWidth={false}
        placement="bottomRight"
        onChange={val => setDataBy(val)}
        options={[{value: 'Type'}, {value: 'Category'}, {value: 'Status'}, {value: 'Classification'}]}
      />
    </div>
  )

  if(loading) {
    return <AntdLoader />
  }

  const getDataForChart = (array, colors) => array?.map((row, i) => {
    return {
      title: row.Title,
      count: row.Count,
      type: row.key,
      countLabel: `${row.Count} SR.`,
      color: colors[i]
    }
  });
  const _TypeColors = ['#deafb2', '#a23881', '#ffa20a', '#9c404f', '#733143', '#2ba54f', '#342b36', '#ab354d', '#e6b2ca', '#b6f90b', '#2decde', '#259231', '#e65586', '#b861d0', '#6ef7ad', '#e54891', '#8f5701', '#a54d68', '#13b4c8', '#c86c7c', '#e873b1', '#fabeef', '#f2633b', '#752582', '#47a211', '#d0747a', '#7131b6', '#b42f38', '#211649'];
  const _CategoryColors = ['#bccb35', '#857958'];
  const _StatusColors = ['#66a96a'];
  const _ClassificationsColors = ['#67ee3e', '#44e4b8', '#ffff41'];
  const ByType = getDataForChart(data?.assetsByType, _TypeColors);
  const ByCategory = getDataForChart(data?.assetsByCategory, _CategoryColors);
  const ByStatus = getDataForChart(data?.assetsByStatus, _StatusColors);
  const Classifications = getDataForChart(data?.classifications, _ClassificationsColors);

  return (
    <div>
      <Row gutter={[25, 25]}>
        <Col span={12}>
          <Card>
            <Statistic
              title="Assets"
              value={data?.AssetsCount}
              prefix={<ApiOutlined />}
              valueStyle={{ fontWeight: 700, fontSize: '2rem' }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic
                title="Delivery Letters"
                value={data?.DeliveryNoteCount}
                prefix={<MailOutlined />}
                valueStyle={{ fontWeight: 700, fontSize: '2rem' }}
              />
          </Card>
        </Col>
        <Col span={24}>
          <Card title={CardTitle}>
            <LineChart
              totalCount={data?.AssetsCount}
              totalSpan="Total Items."
              items={
                dataBy == "Type"
                ? ByType
                : dataBy == "Category"
                ? ByCategory
                : dataBy == "Status"
                ? ByStatus
                : dataBy == "Classification"
                ? Classifications
                : []
              }
            /> 
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard