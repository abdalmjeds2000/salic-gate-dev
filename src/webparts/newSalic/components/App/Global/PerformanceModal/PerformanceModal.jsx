import React, { useContext, useEffect, useState } from 'react';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Bullet } from '@ant-design/plots';
import { Modal, Table, Tooltip, Typography } from 'antd';
import kpiColorByRate from '../../Global/kpiColorByRate';
import axios from 'axios';
import { AppCtx } from '../../App';



const mappingPerfomanceData = (data) => {
  let groups = data.reduce((r, a) => {
    r[a.OBJECTIVES] = [...(r[a.OBJECTIVES] || []), a];
    return r;
  }, {});

  let result = [];
  Object.values(groups).map((row, i) => {
    let rowKPIs = Object.values(row).reduce((r, a) => {
      r[a.KPI_NAME.toLowerCase()] = [
        ...(r[a.KPI_NAME.toLowerCase()] || []),
        a,
      ];
      return r;
    }, {});


    // get average of MEASURE_ACHIEVE for each objective
    const x = data.filter(item => item?.OBJECTIVES?.toLowerCase() === Object.keys(groups)[i].toLowerCase());
    const y = x.reduce((a, b) => a + b.MEASURE_ACHIEVE, 0) / x.length;
    result.push({
      key: 'row-level-1',
      header: Object.keys(groups)[i],
      Obj_MEASURE_ACHIEVE: y,
    });
    Object.values(rowKPIs).map((k, ki) => {
      result.push({
        key: k[0].ID,
        parent: Object.keys(groups)[i],
        header: Object.keys(rowKPIs)[ki],
        groupBy: "KPI",
        ...k[0]
      });
    });
  })
  return result;
};




const PerformanceModal = ({ openModal, setOpenModal, year, email }) => {
  const { user_data } = useContext(AppCtx);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const columns = [
    { 
      title: 'Objective / KPI', 
      dataIndex: 'KPI_NAME', 
      width: '55%', 
      render: (v, r) => {
        if(r.groupBy === "KPI") { 
          return <div style={{marginLeft: '15px', minWidth: 150}}>
            <Typography.Text strong style={{fontSize: '0.9rem'}}>{v}</Typography.Text> <br />
            <Tooltip title="Start & End Dates" mouseEnterDelay={1}><Typography.Text type='secondary'>{new Date(r.START_DATE).toLocaleDateString()} <ArrowRightOutlined /> {new Date(r.END_DATE).toLocaleDateString()}</Typography.Text></Tooltip>
          </div>
        } else {
          // console.log(chartValue);
          const chartValue = typeof r.Obj_MEASURE_ACHIEVE === "number" ? r.Obj_MEASURE_ACHIEVE.toFixed(1).replace(/\.?0*$/,'') : 0;

          const colorByRate = new kpiColorByRate(chartValue);

          const dataChart = [
            {
              title: 'KPI',
              ranges: [+100+10],
              Measure: [+chartValue],
              Target: 100,
            },
          ];
          const configChart = {
            data: dataChart,
            height: 30,
            width: 300,
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
          return <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 15}}>
            <Typography.Text strong style={{fontSize: '1.1rem'}}>{r.header}</Typography.Text>
            <Bullet {...configChart} />
          </div>
        }
      },
      onCell: (record, index) => {
        // record.Unit => to check if record just a title or full record
        return { colSpan: record.KPI_NAME ? 1 : 6 };
      },
    },
    { title: '%', dataIndex: 'MEASURE_ACHIEVE', width: '10%', render: (val, r) => val ? <Tooltip title={`You have achieved ${val}% of target`} mouseEnterDelay={.5}><>{val}% ({r.WEIGHTAGE})</></Tooltip> : ' - ', onCell: (record, index) => { return { colSpan: record.KPI_NAME ? 1 : 0 }} },
    { title: 'Target', dataIndex: 'TARGET', width: '10%', onCell: (record, index) => { return { colSpan: record.KPI_NAME ? 1 : 0 }} },
    { 
      title: 'UOM', 
      dataIndex: 'UOM', 
      width: '10%', 
      render: (val) => (
        ["number", "#"].includes(val?.toLowerCase()) 
          ? "#" 
        : ["percentage", "%"].includes(val?.toLowerCase())
          ? "%"
        : "%"
      ),
      onCell: (record, index) => { return { colSpan: record.KPI_NAME ? 1 : 0 }}
    },
    { title: 'Manager KPI', dataIndex: 'Manager_KPI', width: '5%', render: (val) => val ? val : '-', onCell: (record, index) => { return { colSpan: record.KPI_NAME ? 1 : 0 }} },
    { title: 'Achieve Date', dataIndex: 'ACHIEVE_DATE', width: '10%', render: (val) => val ? new Date(val).toLocaleDateString() : ' - ', onCell: (record, index) => { return { colSpan: record.KPI_NAME ? 1 : 0 }} }
  ];
  const fetchData = async () => {
    setLoading(true);
    const res = await axios.get(`https://dev.salic.com/api/user/performanceForYear?Email=${email}&Year=${year}`);
    if(Array.isArray(res?.data) && res.status === 200) {
      setData(mappingPerfomanceData(res.data));
      setLoading(false);
    }
  }
  console.log('year', year);
  useEffect(() => {
    if(year && Object.keys(user_data)?.length > 0) {
      fetchData();
    } else {
      setData([]);
    }
  }, [user_data, year]);
  useEffect(() => {
    setData([]);
  }, [openModal]);
  return (
    <Modal
      title="Performance KPI's"
      open={openModal}
      onCancel={() => setOpenModal(false)}
      okButtonProps={{ style: {display: 'none'}}}
      className="more-width-antd-modal"
      destroyOnClose
    >
      <div style={{overflowX: 'auto'}}>
        <Table
          columns={columns} 
          dataSource={data}
          pagination={false}
          loading={loading}
        />
      </div>
    </Modal>
  )
}

export default PerformanceModal