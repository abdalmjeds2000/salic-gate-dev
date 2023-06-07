import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppCtx } from '../App';
import HistoryNavigation from '../Global/HistoryNavigation/HistoryNavigation';


function AnnualReports() {
  const { defualt_route } = useContext(AppCtx);
  let navigate = useNavigate();

  return (
    <>
      <HistoryNavigation>
        <a onClick={() => navigate(`${defualt_route}/salic-profile`)}>SALIC Profile</a>
        <p>Annual Reports</p>
      </HistoryNavigation>
      <div className='folder-explorer-container'>  
        <iframe
          name='Annual Reports'
          src='https://salic-my.sharepoint.com/personal/hassan_alshaiekh_salic_com/_layouts/15/onedrive.aspx?ga=1&id=/personal/hassan_alshaiekh_salic_com/Documents/Desktop/Salic Onedrive/Media/to Abdulmohsen/Annual Reports'
          width='100%'
          height='100%'
        >
        </iframe>
      </div>
    </>
  )
}

export default AnnualReports