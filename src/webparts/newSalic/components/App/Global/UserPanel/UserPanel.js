import React, {useContext, useState} from 'react'
import './UserPanel.css';
import { useNavigate } from 'react-router-dom'
import UserSettingsPanel from '../UserSettingsPanel/UserSettingsPanel';
import { AppCtx } from '../../App';
import { Tooltip } from 'antd';

const UserPanel = (props) => {
  const [showUserDetails, setShowUserDetails] = useState(false);
  const { defualt_route } = useContext(AppCtx);
  const navigate = useNavigate();

  var mobile = (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));

  return (
    <div className='user-panel-container'>
      <div className='icons'>
        
        <Tooltip title="Meetings Services Center" placement='bottom'>
          {/* <a onClick={() => navigate(`${defualt_route}/book-meeting-room`)}> */}
          <a onClick={() => {
            if(mobile) {
              navigate(`${defualt_route}/book-meeting-room`);
            } else {
              window.open(`${defualt_route}/book-meeting-room`, '_blank');
            }
          }}>
            {/* <img src={BookingIcon} alt="" /> */}
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 31.518 31.518" style={{fontSize: '17px'}}>
              <g id="svgexport-10" transform="translate(-2 -2)">
                <g id="Layer_2" data-name="Layer 2" transform="translate(2 2)">
                  <path id="Path_5091" data-name="Path 5091" d="M33.518,11.005V7.628a3.377,3.377,0,0,0-3.377-3.377h-4.5V3.126a1.126,1.126,0,1,0-2.251,0V4.251H12.131V3.126a1.126,1.126,0,1,0-2.251,0V4.251h-4.5A3.377,3.377,0,0,0,2,7.628v3.377Z" transform="translate(-2 -2)" fill="#b5cfed"/>
                  <path id="Path_5092" data-name="Path 5092" d="M2,12V28.885a3.377,3.377,0,0,0,3.377,3.377H30.141a3.377,3.377,0,0,0,3.377-3.377V12Zm22.119,6.483-7.88,6.754a1.126,1.126,0,0,1-1.528-.06L11.335,21.8a1.126,1.126,0,1,1,1.592-1.592l2.641,2.641,7.092-6.078a1.126,1.126,0,1,1,1.463,1.71Z" transform="translate(-2 -0.744)" fill="#b5cfed"/>
                </g>
              </g>
            </svg>
          </a>
        </Tooltip>
        
        <Tooltip title="Mail" placement='bottom'>
          <a href={props.mailTo} target='_blank'>
            <svg id="Iconly_Bold_Message" data-name="Iconly/Bold/Message" xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42">
              <g id="Message" transform="translate(3.521 5.28)">
                <path id="Message-2" data-name="Message" d="M26.291,31.678H8.9A8.906,8.906,0,0,1,0,22.791V8.887A8.906,8.906,0,0,1,8.9,0H26.291a8.96,8.96,0,0,1,6.3,2.607A8.82,8.82,0,0,1,35.2,8.887v13.9A8.907,8.907,0,0,1,26.291,31.678ZM7.1,9.232a1.29,1.29,0,0,0-.94.4,1.345,1.345,0,0,0-.125,1.76l.231.228,8.007,6.249a5.507,5.507,0,0,0,3.432,1.2,5.6,5.6,0,0,0,3.447-1.2l7.94-6.353.141-.141a1.362,1.362,0,0,0-.021-1.76,1.463,1.463,0,0,0-.93-.458l-.074,0a1.337,1.337,0,0,0-.914.354l-7.935,6.336a2.754,2.754,0,0,1-1.754.634,2.8,2.8,0,0,1-1.766-.634L7.92,9.5A1.369,1.369,0,0,0,7.1,9.232Z" fill="#b5cfed"/>
              </g>
            </svg>

            { 
              props.mailCount > 0 && 
              <span className="badge mail-count" style={{top: '-10px'}}>
                {props.mailCount > 99 ? '99+' : props.mailCount}
              </span> 
            }
          </a>
        </Tooltip>
        
        <Tooltip title="Notification Center" placement='bottom'>
          <a onClick={() => {
            if(mobile) {
              navigate(`${defualt_route}/notification-center`);
            } else {
              window.open(`${defualt_route}/notification-center`, '_blank');
            }
          }}>
            <svg id="Iconly_Bold_Notification" data-name="Iconly/Bold/Notification" xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42">
              <g id="Notification" transform="translate(6.16 3.52)">
                <path id="Notification-2" data-name="Notification" d="M14.049,35.139a6.37,6.37,0,0,1-3.016-1.289,2.73,2.73,0,0,1-1.224-2.064c0-.887.813-1.292,1.565-1.467a45.676,45.676,0,0,1,7.121,0c.752.174,1.565.58,1.565,1.467a2.734,2.734,0,0,1-1.223,2.065,6.4,6.4,0,0,1-3.014,1.288,7.03,7.03,0,0,1-.9.059A6.454,6.454,0,0,1,14.049,35.139ZM6.624,27.714a7.981,7.981,0,0,1-5.1-2.487A6.361,6.361,0,0,1,0,21.041a5.927,5.927,0,0,1,1.286-4.066A6.683,6.683,0,0,0,3.157,11.96v-.749a9.9,9.9,0,0,1,2.259-6.79A12.448,12.448,0,0,1,14.881,0h.158A12.392,12.392,0,0,1,24.66,4.619a9.76,9.76,0,0,1,2.1,6.592v.749a6.844,6.844,0,0,0,1.869,5.015,5.92,5.92,0,0,1,1.286,4.066A6.36,6.36,0,0,1,28.4,25.227a7.988,7.988,0,0,1-5.1,2.487c-2.766.234-5.533.434-8.336.434A73.368,73.368,0,0,1,6.624,27.714Z" transform="translate(0)" fill="#b5cfed"/>
              </g>
            </svg>
            { 
              props.notificationsCount > 0 && 
              <span className="badge notifi-count" style={{top: '-10px'}}>
                {props.notificationsCount > 99 ? '99+' : props.notificationsCount}
              </span> 
            }
          </a>
        </Tooltip>
      </div>
      
      <div className='user-info'>
        <h2>{props.userName}</h2>
        <Tooltip title="Settings">
          <img 
            src={props.userImage} 
            alt="" 
            onClick={_ => setShowUserDetails(!showUserDetails)} 
          />
        </Tooltip>
      </div>
      {
        showUserDetails
        ? <UserSettingsPanel
            userName={props.userName}
            userImage={props.userImage}
            onClickClose={() => setShowUserDetails(!showUserDetails)}
          />
        : null
      }
    </div>
  )
}

export default UserPanel