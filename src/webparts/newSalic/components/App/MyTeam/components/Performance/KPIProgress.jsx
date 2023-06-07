import React from 'react';
import { Card, Col, Empty, Row, Typography } from 'antd';
import KPICard from './KPICard/KPICard';
import { Bullet } from '@ant-design/plots';
import kpiColorByRate from '../../../Global/kpiColorByRate'

const KPIProgress = ({ kpiItems, total, userData }) => {

  const _chartTotal = total?.replace(/[ %]/g, '') || 0 ;
  const colorByRate = new kpiColorByRate(+_chartTotal);

  const dataChart = [
    {
      title: 'KPI',
      ranges: [100+5],
      Measure: [+_chartTotal],
      Target: 100,
    },
  ];
  const configChart = {
    data: dataChart,
    height: 30,
    measureField: 'Measure',
    rangeField: 'ranges',
    targetField: 'Target',
    xField: 'title',
    color: {
      range: '#ffffff',
      measure: colorByRate.getColor(),
      target: colorByRate.getDarkColor(),
    },
    xAxis: false,
    yAxis: false,
    legend: false,
  };



  if(!kpiItems || kpiItems.length == 0) {
    return (
      <div style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>
        <Empty />
      </div>
    )
  }
  return (
    <div style={{padding: '10px 0'}}>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <Card title={<Typography.Text strong style={{fontSize: '1.2rem'}}>{userData.DisplayName + '\'s'}</Typography.Text>} style={{marginBottom: 10}}>
            <Typography.Text style={{fontSize: '4em', display: 'inline-block', margin: '0 10px 10px 0', fontWeight: 700}}>
              {total}
            </Typography.Text>
            <Typography.Text>KPI Progress Average</Typography.Text>
            <br />
            <Bullet {...configChart} />
          </Card>
        </Col>
        {
          kpiItems.map((row, i) => (
            <Col key={i} xs={24} sm={12} md={12} lg={8} xl={8} xxl={6}>
              <KPICard
                title={row.KPI_NAME.replace(/[%#]/g, '').trim()}
                description={row.OBJECTIVES}
                sDate={new Date(row.START_DATE).toLocaleDateString()}
                eDate={new Date(row.END_DATE).toLocaleDateString()}
                achieveDate={row.ACHIEVE_DATE ? new Date(row.ACHIEVE_DATE).toLocaleDateString() : null}
                value={row?.MEASURE_ACHIEVE}
                maxVal={100}
                valueType={
                  ["number", "#"].includes(row.UOM?.toLowerCase()) 
                    ? "#" 
                  : ["percentage", "%"].includes(row.UOM?.toLowerCase())
                    ? "%"
                  : "%"
                }
              />
            </Col>
          ))
        }
      </Row>
    </div>
  )
}

export default KPIProgress