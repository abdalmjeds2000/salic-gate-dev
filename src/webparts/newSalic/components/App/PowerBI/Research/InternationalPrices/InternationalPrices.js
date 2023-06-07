import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import ProtectRoutePowerBI from '../../../../Routers/ProtectRoutes/ProtectRoutePowerBI';
import { AppCtx } from '../../../App';
import HistoryNavigation from '../../../Global/HistoryNavigation/HistoryNavigation';



function InternationalPrices() {
  const navigate = useNavigate();
  const { defualt_route } = useContext(AppCtx);
  
  return (
    <ProtectRoutePowerBI>
      <HistoryNavigation>
        <a onClick={() => navigate(`${defualt_route}/power-bi-dashboards`)}>Power BI Interactive Dashboards</a>
        <a onClick={() => navigate(`${defualt_route}/power-bi-dashboards/research`)}>Research</a>
        <p>International Prices</p>
      </HistoryNavigation>
      
      <div className='folder-explorer-container'>

        <div className='power-bi-iframe-container'>
          <iframe 
            title="International Prices" 
            width="100%" 
            height="100%" 
            src="https://app.powerbi.com/reportEmbed?reportId=c21201cc-6307-4195-8572-a9d003e2df70&autoAuth=true&ctid=bea1b417-4237-40b8-b020-57fce9abdb43&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXdlc3QtZXVyb3BlLWQtcHJpbWFyeS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D" 
            frameborder="0" 
            allowFullScreen="true"
          ></iframe>
        </div>
      </div>
    </ProtectRoutePowerBI>
  )
}

export default InternationalPrices