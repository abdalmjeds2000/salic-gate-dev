import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import HistoryNavigation from "../../Global/HistoryNavigation/HistoryNavigation";
import ServicesSection from "../../Global/ServicesSection/ServicesSection";
import { AppCtx } from '../../App';


const AlmiraVersions = () => {
  const { defualt_route } = useContext(AppCtx);
  let navigate = useNavigate();

  return (
    <div>
      <HistoryNavigation>
        <a onClick={() => navigate(`${defualt_route}/salic-profile`)}>SALIC Profile</a>
        <p>Almira Versions</p>
      </HistoryNavigation>
      
      <div className='standard-page it-center-container'>
        <ServicesSection
          title="Almira Versions"
          items={[
            {icon: '1', isLink: false, to: '/salic-profile/almira-versions/almira-magazine', bgColor: '#7722ff', text: 'Version 1', description: "2020-2021"},
            {icon: '2', isLink: true, bgColor: '#ff33ff', text: 'Version 2', description: "2021-2022", to: 'https://salic-my.sharepoint.com/personal/hassan_alshaiekh_salic_com/_layouts/15/onedrive.aspx?ga=1&id=/personal/hassan_alshaiekh_salic_com/Documents/Desktop/Salic Onedrive/Media/to Abdulmohsen/AlMira/مجلة-الميرة-العدد-الثاني-s.pdf&parent=/personal/hassan_alshaiekh_salic_com/Documents/Desktop/Salic Onedrive/Media/to Abdulmohsen/AlMira'},
          ]}
        />
      </div>
    </div>
  )
}

export default AlmiraVersions