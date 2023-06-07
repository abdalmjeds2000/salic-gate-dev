import React from 'react';
import './PowerBIInteractiveDashboards.css';
import HistoryNavigation from '../Global/HistoryNavigation/HistoryNavigation';
import { icons } from './boxesData';
import ServicesSection from '../Global/ServicesSection/ServicesSection';
import ProtectRoutePowerBI from '../../Routers/ProtectRoutes/ProtectRoutePowerBI';


function PowerBIInteractiveDashboards() {
  const services = [
    {icon: icons.CreateInvoiceRequest, bgColor: 'rgb(39, 124, 98)', isLink: false, text: 'Human Capital', to: '/power-bi-dashboards/human-capital'},
    {icon: icons.ReceiveOrderItems, bgColor: 'rgb(233, 155, 77)', isLink: false, text: 'Research', to: '/power-bi-dashboards/research'},
  ];
  
  return (
    <ProtectRoutePowerBI>
      <HistoryNavigation>
        <p>Power BI Interactive Dashboards</p>
      </HistoryNavigation>
      <div className='standard-page'>
        <ServicesSection
          title="Interactive Dashboards"
          items={services}
        />
      </div>
    </ProtectRoutePowerBI>
  )
}

export default PowerBIInteractiveDashboards