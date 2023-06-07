import React, { useContext } from 'react';
import './AlMiraMagazine.css';
import AlMiraMagazinePoster from '../../../assets/images/almira/almira-poster.jpg';
import HistoryNavigation from '../Global/HistoryNavigation/HistoryNavigation';
import { useNavigate } from 'react-router-dom';
import { AppCtx } from '../App';



const AlMiraMagazine = () => {
  const { defualt_route } = useContext(AppCtx);
  let navigate = useNavigate();

  return (
    <>
      <HistoryNavigation>
        <a onClick={() => navigate(`${defualt_route}/salic-profile`)}>SALIC Profile</a>
        <a onClick={() => navigate(`${defualt_route}/salic-profile/almira-versions`)}>Almira Versions</a>
        <p>Al Mira Magazine</p>
      </HistoryNavigation>
      <div className='almira-magazine-container'>
        <div className='image'>
          <img src={AlMiraMagazinePoster} alt="AlMira Magazine" />
        </div>
        <div className='content'>
          <div className='header'>
            <h1>AlMira Magazine | مجلة الميرة</h1>
            <p>First Issue : Q1 2020</p>
          </div>
          <div className='description'>
            <p><b>Description</b></p>
            <p>Quartely magazine published Saudi Agricultural and Livestock Company "SALIC" under Corporate Communication Department.</p>
          </div>
          <div className='en-ar-btns'>
            <a target='blank' href="https://devsalic.sharepoint.com/sites/newsalic/SiteAssets/js/almira/magazine/en/en.aspx">
              English Version
            </a>
            <a target='blank' href="https://devsalic.sharepoint.com/sites/newsalic/SiteAssets/js/almira/magazine/ar/ar.aspx">
              النسخة العربية
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

export default AlMiraMagazine