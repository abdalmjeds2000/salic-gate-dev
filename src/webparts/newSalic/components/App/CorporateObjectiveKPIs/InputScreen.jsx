import React, { useContext } from 'react';
import { Tabs } from 'antd';
import KPIsTable from './KPIsTable';
import { AppCtx } from "../App";
import { useNavigate } from 'react-router-dom';
import HistoryNavigation from '../Global/HistoryNavigation/HistoryNavigation';

const items = [
  { label: '2022', key: '1', children: <KPIsTable kpiYear={{year: 2022}} /> }, // remember to pass the key prop
  { label: '2023', key: '2', children: <KPIsTable kpiYear={{year: 2023}} /> },
];
const InputScreen = () => {
  const { defualt_route } = useContext(AppCtx);
  const navigate = useNavigate();


  return (
    <>
      <HistoryNavigation>
        <a onClick={() => navigate(`${defualt_route}/hc-services`)}>Human Capital Services</a>
        <a onClick={() => navigate(defualt_route + "/corporate-objective")}>Corporate Objective KPIs</a>
        <p>Manage KPIs</p>
      </HistoryNavigation>
      <div className='standard-page'>
        <Tabs 
          defaultActiveKey="1"
          type="card"
          size="large"
          items={items} />
      </div>
    </>
  )
}

export default InputScreen