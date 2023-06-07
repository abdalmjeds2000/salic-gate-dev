import React, { useContext } from "react";
import { useNavigate } from 'react-router-dom';
import './PersonInfoMobile.css';
import { AppCtx } from '../../../../App';

function PersonInfoMobile() {
  const { user_data, notifications_count, mail_count, defualt_route, sp_site } = useContext(AppCtx);
  let navigate = useNavigate();


  var mobile = (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));

  if(Object.keys(user_data).length === 0) {
    return null
  }
  return (
    <div className="person person-mobile" id="person-mobile">
      <div className="person-info person-info-mobile">
        <div className="person-control-buttons">
          <a onClick={() => {
            if(mobile) {
              navigate(`${defualt_route}/my-team`);
            } else {
              window.open(`${defualt_route}/my-team`, '_blank')
            }
          }}>
            <svg style={{width: '1.5rem'}} xmlns="http://www.w3.org/2000/svg"width="35" height="35" x="0" y="0" viewBox="0 0 512 512"><g><g><circle cx="256" cy="119.631" r="87" fill="#B5CFED"></circle><circle cx="432" cy="151.63" r="55" fill="#B5CFED"></circle><circle cx="80" cy="151.63" r="55" fill="#B5CFED"></circle><path d="m134.19 256.021c-21.65-17.738-41.257-15.39-66.29-15.39-37.44 0-67.9 30.28-67.9 67.49v109.21c0 16.16 13.19 29.3 29.41 29.3 70.026 0 61.59 1.267 61.59-3.02 0-77.386-9.166-134.137 43.19-187.59z" fill="#B5CFED"></path><path d="m279.81 241.03c-43.724-3.647-81.729.042-114.51 27.1-54.857 43.94-44.3 103.103-44.3 175.48 0 19.149 15.58 35.02 35.02 35.02 211.082 0 219.483 6.809 232-20.91 4.105-9.374 2.98-6.395 2.98-96.07 0-71.226-61.673-120.62-111.19-120.62z" fill="#B5CFED"></path><path d="m444.1 240.63c-25.17 0-44.669-2.324-66.29 15.39 51.965 53.056 43.19 105.935 43.19 187.59 0 4.314-7.003 3.02 60.54 3.02 16.8 0 30.46-13.61 30.46-30.34v-108.17c0-37.21-30.46-67.49-67.9-67.49z" fill="#B5CFED"></path></g></g></svg>
          </a>

          <a href="https://outlook.office.com/owa/" target='blank'>
            <svg id="Iconly_Bold_Message" data-name="Iconly/Bold/Message" xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42">
              <g id="Message" transform="translate(3.521 5.28)">
                <path id="Message-2" data-name="Message" d="M26.291,31.678H8.9A8.906,8.906,0,0,1,0,22.791V8.887A8.906,8.906,0,0,1,8.9,0H26.291a8.96,8.96,0,0,1,6.3,2.607A8.82,8.82,0,0,1,35.2,8.887v13.9A8.907,8.907,0,0,1,26.291,31.678ZM7.1,9.232a1.29,1.29,0,0,0-.94.4,1.345,1.345,0,0,0-.125,1.76l.231.228,8.007,6.249a5.507,5.507,0,0,0,3.432,1.2,5.6,5.6,0,0,0,3.447-1.2l7.94-6.353.141-.141a1.362,1.362,0,0,0-.021-1.76,1.463,1.463,0,0,0-.93-.458l-.074,0a1.337,1.337,0,0,0-.914.354l-7.935,6.336a2.754,2.754,0,0,1-1.754.634,2.8,2.8,0,0,1-1.766-.634L7.92,9.5A1.369,1.369,0,0,0,7.1,9.232Z" fill="#b5cfed"/>
              </g>
            </svg>
            {/* <MessageIcon /> */}
            { 
              mail_count > 0 && 
              <span className="badge mail-count">
                {mail_count > 99 ? '99+' : mail_count}
              </span> }
          </a>
          
          <div className="person-img">
            <img onClick={() => navigate(defualt_route + '/my-team')} src={`${sp_site}/_layouts/15/userphoto.aspx?size=M&username=${user_data.Data?.Mail}`} alt="Person" />
          </div>

          <a onClick={() => {
            if(mobile) {
              navigate(`${defualt_route}/notification-center`);
            } else {
              window.open(`${defualt_route}/notification-center`, '_blank')
            }
          }}>
            <svg id="Iconly_Bold_Notification" data-name="Iconly/Bold/Notification" xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42">
              <g id="Notification" transform="translate(6.16 3.52)">
                <path id="Notification-2" data-name="Notification" d="M14.049,35.139a6.37,6.37,0,0,1-3.016-1.289,2.73,2.73,0,0,1-1.224-2.064c0-.887.813-1.292,1.565-1.467a45.676,45.676,0,0,1,7.121,0c.752.174,1.565.58,1.565,1.467a2.734,2.734,0,0,1-1.223,2.065,6.4,6.4,0,0,1-3.014,1.288,7.03,7.03,0,0,1-.9.059A6.454,6.454,0,0,1,14.049,35.139ZM6.624,27.714a7.981,7.981,0,0,1-5.1-2.487A6.361,6.361,0,0,1,0,21.041a5.927,5.927,0,0,1,1.286-4.066A6.683,6.683,0,0,0,3.157,11.96v-.749a9.9,9.9,0,0,1,2.259-6.79A12.448,12.448,0,0,1,14.881,0h.158A12.392,12.392,0,0,1,24.66,4.619a9.76,9.76,0,0,1,2.1,6.592v.749a6.844,6.844,0,0,0,1.869,5.015,5.92,5.92,0,0,1,1.286,4.066A6.36,6.36,0,0,1,28.4,25.227a7.988,7.988,0,0,1-5.1,2.487c-2.766.234-5.533.434-8.336.434A73.368,73.368,0,0,1,6.624,27.714Z" transform="translate(0)" fill="#b5cfed"/>
              </g>
            </svg>
            {/* <NotificationIcon /> */}
            { 
              notifications_count > 0 && 
              <span className="badge notifi-count">
                {notifications_count > 99 ? '99+' : notifications_count}
              </span> 
            }
          </a>
          <a onClick={() => {
            if(mobile) {
              navigate(`${defualt_route}/book-meeting-room`);
            } else {
              window.open(`${defualt_route}/book-meeting-room`, '_blank')
            }
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 31.518 31.518">
              <g id="svgexport-10" transform="translate(-2 -2)">
                <g id="Layer_2" data-name="Layer 2" transform="translate(2 2)">
                  <path id="Path_5091" data-name="Path 5091" d="M33.518,11.005V7.628a3.377,3.377,0,0,0-3.377-3.377h-4.5V3.126a1.126,1.126,0,1,0-2.251,0V4.251H12.131V3.126a1.126,1.126,0,1,0-2.251,0V4.251h-4.5A3.377,3.377,0,0,0,2,7.628v3.377Z" transform="translate(-2 -2)" fill="#b5cfed"/>
                  <path id="Path_5092" data-name="Path 5092" d="M2,12V28.885a3.377,3.377,0,0,0,3.377,3.377H30.141a3.377,3.377,0,0,0,3.377-3.377V12Zm22.119,6.483-7.88,6.754a1.126,1.126,0,0,1-1.528-.06L11.335,21.8a1.126,1.126,0,1,1,1.592-1.592l2.641,2.641,7.092-6.078a1.126,1.126,0,1,1,1.463,1.71Z" transform="translate(-2 -0.744)" fill="#b5cfed"/>
                </g>
              </g>
            </svg>
          </a>
          
        </div>
        <div className="person-txt person-txt-mobile">
          <h1>{user_data.Data?.DisplayName}</h1>
          <p>{user_data.Data?.Title}</p>
        </div>
      </div>
      
    </div>
  )
}

export default PersonInfoMobile