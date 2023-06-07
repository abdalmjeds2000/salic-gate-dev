import React, { useContext } from 'react';
import HistoryNavigation from '../Global/HistoryNavigation/HistoryNavigation';
import ProtectRouteCommunication from '../../Routers/ProtectRoutes/ProtectRouteCommunication';
import { AppCtx } from '../App';


function ManageEvents() {
  const { sp_site } = useContext(AppCtx);

  const editStyle = () => {
    var iframe = document.getElementById("spIframe");
    var elmnt = iframe.contentWindow.document.getElementsByClassName("od-ItemsScopeList-content")[0];
    elmnt.style.backgroundColor = "#fff";
  }


  return (
    <ProtectRouteCommunication>
      <HistoryNavigation>
        <p>Manage Saudi Arabia Events</p>
      </HistoryNavigation>
      <div className='folder-explorer-container'>  
        <iframe
          name='Saudi Arabia Events'
          src={`${sp_site}/Lists/Saudi%20Arabia%20Events/AllItems.aspx`}
          width='100%'
          height='100%'
          id='spIframe'
          onLoad={editStyle}
        >
        </iframe>
      </div>
    </ProtectRouteCommunication>
  )
}

export default ManageEvents