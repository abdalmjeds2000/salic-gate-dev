import React, { useContext, useRef } from 'react';
import './FormPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { AppCtx } from '../../../App';
import ToggleButton from '../../../Global/ToggleButton';
import { CgMoreO } from 'react-icons/cg';



function FormPageTemplate(props) {
  const { user_data } = useContext(AppCtx);

  const propertiesSectionRef = useRef();
  const handleShowDetails = (v) => {
    propertiesSectionRef.current.style.display = 
    propertiesSectionRef.current.style.display === "block" ? "none" : "block";
  }
  return (
    <div>
      <div className="content-services-request">
        <div className="header">
          <h1>{props.pageTitle}</h1>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {props.Header}
            <span className='properties-toggle-btn'>
              <ToggleButton
                icon={<CgMoreO />}
                title="more information"
                callback={handleShowDetails}
              />
            </span>
          </div>
        </div>
        
        <div className="content">
          <div className="form">{props.children}</div>
          <div className="tips" ref={propertiesSectionRef}>
            <div className="tips_user-info">
              <div className="tips_user-info_text">
                <div>
                  <p className='title'>{props.UserName || user_data.Data?.DisplayName}</p>
                  <p>{props.UserTitle || user_data.Data?.Title}</p>
                </div>
                <div>
                  <p className='title'>Department</p>
                  <p>{props.UserDept || user_data.Data?.Department || ' - '}</p>
                </div>
                <div>
                  <p className='title'>Nationality</p>
                  <p>{props.UserNationality || user_data.Data?.Nationality || ' - '}</p>
                </div>
                <div>
                  <p className='title'>Employee Id</p>
                  <p>{parseInt(props.EmployeeId, 10) || parseInt(user_data.Data?.PIN, 10) || ' - '}</p>
                </div>
                <div>
                  <p className='title'>Extension</p>
                  <p>{parseInt(props.Extension, 10) || user_data.Data?.Ext || ' - '}</p>
                </div>
                {/* <div>
                  <p><b>ID #</b></p>
                  <p>{props.UserId || user_data.Data?.Iqama || ' - '}</p>
                </div> */}
              </div>
              <div className="tips_user-info_img">
                <img 
                  src={`https://devsalic.sharepoint.com/sites/newsalic/_layouts/15/userphoto.aspx?size=M&username=${props.Email || user_data.Data?.Mail}`} 
                  alt="" 
                />
              </div>
            </div>

            <div>
              {props.beforeTips}
            </div>

            <div className="tips_tips-container">
              <div className="tips_header">
                <FontAwesomeIcon icon={faLightbulb} /> Tips
              </div>
              <ul>
                {
                  props.tipsList?.map((t, i) => {
                    return (
                      <li key={i}>{t}</li>
                    )
                  })
                }
              </ul>
            </div>

            <div>
              {props.afterTips}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default FormPageTemplate