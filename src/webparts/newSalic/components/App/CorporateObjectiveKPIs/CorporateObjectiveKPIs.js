import React, { useContext, useEffect, useState } from 'react';
import { Button } from 'antd';
import { Web } from 'sp-pnp-js';
import { useNavigate } from 'react-router-dom';
import { AppCtx } from '../App';
import HistoryNavigation from '../Global/HistoryNavigation/HistoryNavigation';
import Tabs from '../Global/CustomTabs/Tabs';

const CorporateObjectiveKPIs = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { defualt_route } = useContext(AppCtx);
  const navigate = useNavigate();

  const fetchItems = async () => {
    setLoading(true);
    const web = new Web('https://devsalic.sharepoint.com/sites/MDM');
    const response = await web.lists.getByTitle("KPIs Dashboards").items.get();
    setItems(response);
    setLoading(false);
  }


  useEffect(() => {
    fetchItems();
  }, []);


  const tabsItems = items?.map((item, index) => ({
    key: index + 1,
    title: item.Title,
    content: (
      <iframe
        name={item?.Title}
        src={item?.Link}
        width="100%"
        style={{ border: 0, minHeight: "calc(100vh - 215px)" }}
      />
    ),
  }) || []);
  return (
    <>
      <HistoryNavigation>
        <a onClick={() => navigate(`${defualt_route}/hc-services`)}>Human Capital Services</a>
        <p>Corporate Objective KPIs</p>
      </HistoryNavigation>
      <div className="standard-page">
        <Tabs 
          items={tabsItems} 
          loading={loading} 
          rightOfTabs={(
            <Button type='primary' onClick={() => navigate(defualt_route + "/manage-corporate-objective")}>
              Manage KPIs
            </Button>
          )}
          bodyStyle={{ borderRadius: 0 }} 
        />
        {/* <Button type='primary' size='small' onClick={() => navigate(defualt_route + "/manage-corporate-objective")}>
          Manage KPIs
        </Button> */}
      </div>
    </>
  )
}

export default CorporateObjectiveKPIs