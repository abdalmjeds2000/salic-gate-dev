import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import ProtectRoutePowerBI from '../../../Routers/ProtectRoutes/ProtectRoutePowerBI';
import { AppCtx } from '../../App';
import HistoryNavigation from '../../Global/HistoryNavigation/HistoryNavigation';
import ServicesSection from '../../Global/ServicesSection/ServicesSection';


function Research() {
  const { defualt_route } = useContext(AppCtx);
  const navigate = useNavigate();
  
  const icons = {
    CreateInvoiceRequest: <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 512 512" fill="#fff"><g><g xmlns="http://www.w3.org/2000/svg">  <g>    <rect x="86.588" y="472.785" width="331.294" height="37.647" fill="#FFFFFF"   ></rect>  </g></g><g xmlns="http://www.w3.org/2000/svg">  <g>    <path d="M311.843,169.726H195.765c-10.397,0-18.824,8.427-18.824,18.824s8.427,18.824,18.824,18.824h116.078    c10.397,0,18.824-8.427,18.824-18.824S322.24,169.726,311.843,169.726z" fill="#FFFFFF"   ></path>  </g></g><g xmlns="http://www.w3.org/2000/svg">  <g>    <path d="M399.686,257.569H195.765c-10.397,0-18.824,8.427-18.824,18.824s8.427,18.824,18.824,18.824h203.922    c10.397,0,18.823-8.427,18.823-18.824S410.083,257.569,399.686,257.569z" fill="#FFFFFF"   ></path>  </g></g><g xmlns="http://www.w3.org/2000/svg">  <g>    <path d="M500.907,3.86c-6.758-3.037-14.657-1.838-20.204,3.062l-52.712,46.632L375.216,6.363c-7.147-6.394-17.951-6.394-25.098,0    l-52.706,47.134L244.7,6.363c-7.147-6.394-17.945-6.394-25.092,0l-52.775,47.191L114.121,6.922    c-5.54-4.894-13.446-6.093-20.204-3.062c-6.751,3.043-11.093,9.757-11.093,17.161v335.059h-64C8.427,356.079,0,364.506,0,374.903    v45.804c0,49.474,40.251,89.725,89.725,89.725v-37.647c-28.718,0-52.078-23.366-52.078-52.078v-26.98h294.902v26.98    c0,49.474,40.251,89.726,89.725,89.726c49.474,0,89.725-40.251,89.725-89.725V21.02C512,13.616,507.658,6.903,500.907,3.86z     M474.353,420.707c0,28.712-23.366,52.078-52.078,52.078s-52.078-23.366-52.078-52.078v-45.804    c0-10.397-8.427-18.824-18.824-18.824H120.471V62.802l33.964,30.049c7.153,6.325,17.907,6.293,25.016-0.069l52.706-47.134    l52.706,47.128c7.147,6.394,17.951,6.394,25.098,0l52.712-47.134l52.706,47.134c7.115,6.362,17.87,6.387,25.016,0.069    l33.958-30.042V420.707z" fill="#FFFFFF"   ></path>  </g></g><g xmlns="http://www.w3.org/2000/svg"></g><g xmlns="http://www.w3.org/2000/svg"></g><g xmlns="http://www.w3.org/2000/svg"></g><g xmlns="http://www.w3.org/2000/svg"></g><g xmlns="http://www.w3.org/2000/svg"></g><g xmlns="http://www.w3.org/2000/svg"></g><g xmlns="http://www.w3.org/2000/svg"></g><g xmlns="http://www.w3.org/2000/svg"></g><g xmlns="http://www.w3.org/2000/svg"></g><g xmlns="http://www.w3.org/2000/svg"></g><g xmlns="http://www.w3.org/2000/svg"></g><g xmlns="http://www.w3.org/2000/svg"></g><g xmlns="http://www.w3.org/2000/svg"></g><g xmlns="http://www.w3.org/2000/svg"></g><g xmlns="http://www.w3.org/2000/svg"></g></g></svg>,
  }
  const services = [
    {icon: icons.CreateInvoiceRequest, isLink: false, bgColor: '#70CFAF', text: 'Country Outlook', to: '/power-bi-dashboards/research/country-outlook'},
    {icon: icons.CreateInvoiceRequest, isLink: false, bgColor: '#E4A7EB', text: 'Delegation Visit', to: '/power-bi-dashboards/research/delegation-visit'},
    {icon: icons.CreateInvoiceRequest, isLink: false, bgColor: '#43A2CC', text: 'Crisis Plan', to: '/power-bi-dashboards/research/crisis-plan'},
    {icon: icons.CreateInvoiceRequest, isLink: false, bgColor: 'rgb(233, 155, 77)', text: 'Demand Forecast', to: '/power-bi-dashboards/research/demand-forecast'},
    {icon: icons.CreateInvoiceRequest, isLink: false, bgColor: '#F7937B', text: 'Domestic Prices', to: '/power-bi-dashboards/research/domestic-prices'},
    {icon: icons.CreateInvoiceRequest, isLink: false, bgColor: '#70CFAF', text: 'International Prices', to: '/power-bi-dashboards/research/international-prices'},
    {icon: icons.CreateInvoiceRequest, isLink: false, bgColor: '#43A2CC', text: 'Daily Dashboard', to: '/power-bi-dashboards/research/daily-dashboard'},
  ];
  
  return (
    <ProtectRoutePowerBI>
      <HistoryNavigation>
        <a onClick={() => navigate(`${defualt_route}/power-bi-dashboards`)}>Power BI Interactive Dashboards</a>
        <p>Research</p>
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

export default Research