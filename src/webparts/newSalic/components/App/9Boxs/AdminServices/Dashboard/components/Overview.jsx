import React from 'react';
import { Card, Typography, DatePicker } from 'antd';
import { Column } from '@ant-design/plots';
import moment from 'moment';


const getAdminName = (name) => {
  return (
    name === 'VISA' ? 'Issue VISA' 
    : name === 'BusinessGates' ? 'Business Gates' 
    : name === 'Shipment' ? 'Shipment' 
    : name === 'OfficeSupplies' ? 'Office Supplies' 
    : name === 'Maintenance' ? 'Maintenance' 
    : name === 'Visitors' ? 'Visitors' 
    : name === 'Transportations' ? 'Transportations' 
    : '-'
  );
}


// Get today's date
const today = new Date();
// Get the date 30 days ago
const last30Days = new Date(today);
last30Days.setDate(today.getDate() - 30);



const Overview = ({ data, onDateChange }) => {
  const chartDataFilter = () => {
    const d = [];
    Object.keys(data).forEach(name => {
      const _l = data[name];
      _l.forEach(item => d.push({value: item.Count, name: getAdminName(name), type: item.Key === "FIN" ? "Closed" : "Pending"}))
    });
    return d;
  }
  const chartData = chartDataFilter();
  const config = {
    data: chartData,
    height: 525,
    xField: 'name',
    yField: 'value',
    seriesField: 'type',
    isGroup: true,
    color: ({ type }) => {
      if (type === 'Closed') {
        return "#1bb87e";
      }
      return "#ffc823";
    },
    animation: {
      appear: {
        animation: 'none',
      },
    },
  };

  const CardTitle = (
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap'}}>
      <Typography.Text strong style={{fontSize: '1.2rem'}}>Overview</Typography.Text>
      <DatePicker.RangePicker 
        allowClear={false} 
        bordered={false} 
        onChange={onDateChange} 
        defaultValue={[moment(today), moment(last30Days)]}
        style={{ maxWidth: 250 }} />
    </div>
  );
  return (
    <div>
      <Card style={{height: '100%'}} title={CardTitle}>
        <Column {...config} />
      </Card>
    </div>
  )
}

export default Overview