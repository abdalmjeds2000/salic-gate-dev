import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ProtectRouteResearch from '../../../../../../Routers/ProtectRoutes/ProtectRouteResearch';
import { AppCtx } from '../../../../../App';
import HistoryNavigation from '../../../../../Global/HistoryNavigation/HistoryNavigation';


function ResearchCountry() {
  const { defualt_route, sp_site } = useContext(AppCtx);
  let navigate = useNavigate();

  return (
    <ProtectRouteResearch>
      <HistoryNavigation>
        <a onClick={() => navigate(defualt_route + '/research-library')}>Research Library</a>
        <a onClick={() => navigate(defualt_route + '/manage-research-library')}>Manage Research Library Content</a>
        <p>Research Country</p>
      </HistoryNavigation>
      <div className='folder-explorer-container'>  
        <iframe
          name='Research Country'
          src={`${sp_site}/Lists/Research%20Country%20Outlook/AllItems.aspx`}
          width='100%'
          height='100%'
        >
        </iframe>
      </div>
    </ProtectRouteResearch>
  )
}

export default ResearchCountry