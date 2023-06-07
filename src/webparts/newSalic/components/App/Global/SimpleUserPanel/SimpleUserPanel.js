import React, { useContext, useState } from 'react';
import './SimpleUserPanel.css';
import UserSettingsPanel from '../UserSettingsPanel/UserSettingsPanel';
import { AppCtx } from '../../App';
import { Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';

function SimpleUserPanel() {
  const [showUserDetails, setShowUserDetails] = useState(false);
  const { defualt_route, user_data, notifications_count, mail_count, sp_site } = useContext(AppCtx);
  const navigate = useNavigate();

  var mobile = (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));

  return (
    <>
      <div className='simple-user-panel'>
        <img 
          src={`${sp_site}/_layouts/15/userphoto.aspx?size=M&username=${user_data?.Data?.Mail}`} 
          alt=""
          onClick={() => setShowUserDetails(!showUserDetails)} 
        />
        <p title={user_data?.Data?.DisplayName}>{user_data?.Data?.DisplayName}</p>
        <div className='icons'>
          <Tooltip title="Notification Center" placement='bottom'>
            <a onClick={() => {
              if(mobile) {
                navigate(`${defualt_route}/notification-center`);
              } else {
                window.open(`${defualt_route}/notification-center`, '_blank');
              }
            }}>
              <svg id="Iconly_Light_Notification" data-name="Iconly/Light/Notification" xmlns="http://www.w3.org/2000/svg" width="24" height="23" viewBox="0 0 24 23">
                <g id="Notification" transform="translate(3.413 1.95)">
                  <path id="Path_425" d="M0,11.493v-.214A3.51,3.51,0,0,1,.587,9.506,4.749,4.749,0,0,0,1.751,7.25c0-.65,0-1.309.057-1.959C2.1,2.163,5.194,0,8.25,0h.076c3.056,0,6.149,2.163,6.452,5.291.057.65,0,1.309.047,1.959a4.831,4.831,0,0,0,1.164,2.265,3.419,3.419,0,0,1,.587,1.764v.2a3.477,3.477,0,0,1-.823,2.33A4.393,4.393,0,0,1,12.97,15.15a43.952,43.952,0,0,1-9.375,0A4.441,4.441,0,0,1,.814,13.814,3.514,3.514,0,0,1,0,11.493Z" transform="translate(0)" fill="none" stroke="#6477aa" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/>
                  <path id="Path_421" d="M0,0A2.984,2.984,0,0,0,1.986,1.1,3.011,3.011,0,0,0,4.181.492,2.814,2.814,0,0,0,4.692,0" transform="translate(5.904 18.381)" fill="none" stroke="#6477aa" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/>
                </g>
              </svg>
              {
                notifications_count > 0 && 
                <span className="badge notifi-count">
                  {notifications_count > 9 ? '9+' : notifications_count}
                </span>}
            </a>
          </Tooltip>
          <Tooltip title="Mail" placement='bottom'>
            <a href="https://outlook.office.com/owa/" target="blank">
              <svg id="Iconly_Light_Message" data-name="Iconly/Light/Message" xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23">
                <g id="Message" transform="translate(1.95 3.413)">
                  <path id="Path_445" d="M11.031,0,6.872,3.348a2.168,2.168,0,0,1-2.677,0L0,0" transform="translate(3.855 5.422)" fill="none" stroke="#6477aa" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/>
                  <path id="Rectangle_511" d="M4.766,0h9.192a4.833,4.833,0,0,1,3.491,1.55,4.892,4.892,0,0,1,1.293,3.611v6.365a4.892,4.892,0,0,1-1.293,3.611,4.833,4.833,0,0,1-3.491,1.55H4.766C1.919,16.689,0,14.372,0,11.527V5.162C0,2.316,1.919,0,4.766,0Z" fill="none" stroke="#6477aa" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/>
                </g>
              </svg>
              {
                mail_count > 0 && 
                <span className="badge mail-count">
                  {mail_count > 9 ? '9+' : mail_count}
                </span>
              }
            </a>
          </Tooltip>
        </div>
        {
          showUserDetails
          ? <UserSettingsPanel
              userName={user_data?.Data?.DisplayName}
              userImage={`${sp_site}/_layouts/15/userphoto.aspx?size=M&username=${user_data?.Data?.Mail}`}
              onClickClose={() => setShowUserDetails(!showUserDetails)}
            />
          : null
        }
      </div>
    </>
  )
}

export default SimpleUserPanel