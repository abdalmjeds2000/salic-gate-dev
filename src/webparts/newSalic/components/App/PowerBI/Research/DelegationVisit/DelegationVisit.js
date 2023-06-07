import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import ProtectRoutePowerBI from '../../../../Routers/ProtectRoutes/ProtectRoutePowerBI';
import { AppCtx } from '../../../App';
import HistoryNavigation from '../../../Global/HistoryNavigation/HistoryNavigation';



function DelegationVisit() {
  const navigate = useNavigate();
  const { defualt_route } = useContext(AppCtx);
  
  return (
    <ProtectRoutePowerBI>
      <HistoryNavigation>
        <a onClick={() => navigate(`${defualt_route}/power-bi-dashboards`)}>Power BI Interactive Dashboards</a>
        <a onClick={() => navigate(`${defualt_route}/power-bi-dashboards/research`)}>Research</a>
        <p>Delegation Visit</p>
      </HistoryNavigation>
      
      <div className='folder-explorer-container'>

        <div className='power-bi-iframe-container'>
          <iframe 
            title="Delegation Visit" 
            width="100%" 
            height="100%" 
            src="https://app.powerbi.com/reportEmbed?reportId=58d486a3-dde4-4955-9c4d-a8e9daf6c0e9&autoAuth=true&ctid=bea1b417-4237-40b8-b020-57fce9abdb43" 
            frameborder="0" 
            allowFullScreen="true"
          ></iframe>
        </div>
        
      </div>
    </ProtectRoutePowerBI>
  )
}

export default DelegationVisit