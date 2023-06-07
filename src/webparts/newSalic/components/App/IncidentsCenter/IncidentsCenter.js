import React, { useContext, useEffect, useState } from 'react';
import { AppCtx } from '../App';
import HistoryNavigation from "../Global/HistoryNavigation/HistoryNavigation";
import ServicesSection from "../Global/ServicesSection/ServicesSection";
import pnp from 'sp-pnp-js';
import './IncidentsReports.css';



const icons = {
  NewMeeting: <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 512 512" fill="#fff"><g><g xmlns="http://www.w3.org/2000/svg">  <g>    <path d="M256,0C114.833,0,0,114.833,0,256s114.833,256,256,256s256-114.853,256-256S397.167,0,256,0z M256,472.341    c-119.275,0-216.341-97.046-216.341-216.341S136.725,39.659,256,39.659S472.341,136.705,472.341,256S375.295,472.341,256,472.341z    " fill="#FFFFFF"></path>  </g></g><g xmlns="http://www.w3.org/2000/svg">  <g>    <path d="M355.148,234.386H275.83v-79.318c0-10.946-8.864-19.83-19.83-19.83s-19.83,8.884-19.83,19.83v79.318h-79.318    c-10.966,0-19.83,8.884-19.83,19.83s8.864,19.83,19.83,19.83h79.318v79.318c0,10.946,8.864,19.83,19.83,19.83    s19.83-8.884,19.83-19.83v-79.318h79.318c10.966,0,19.83-8.884,19.83-19.83S366.114,234.386,355.148,234.386z" fill="#FFFFFF"></path>  </g></g><g xmlns="http://www.w3.org/2000/svg"></g><g xmlns="http://www.w3.org/2000/svg"></g><g xmlns="http://www.w3.org/2000/svg"></g><g xmlns="http://www.w3.org/2000/svg"></g><g xmlns="http://www.w3.org/2000/svg"></g><g xmlns="http://www.w3.org/2000/svg"></g><g xmlns="http://www.w3.org/2000/svg"></g><g xmlns="http://www.w3.org/2000/svg"></g><g xmlns="http://www.w3.org/2000/svg"></g><g xmlns="http://www.w3.org/2000/svg"></g><g xmlns="http://www.w3.org/2000/svg"></g><g xmlns="http://www.w3.org/2000/svg"></g><g xmlns="http://www.w3.org/2000/svg"></g><g xmlns="http://www.w3.org/2000/svg"></g><g xmlns="http://www.w3.org/2000/svg"></g></g></svg>,
  CreateInvoiceRequest: <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 60 60"><g><path d="M25.011,15.178a2.3,2.3,0,0,0-4.019,0L13.327,28.4a2.433,2.433,0,0,0,0,2.425A2.3,2.3,0,0,0,15.335,32h15.33a2.3,2.3,0,0,0,2.01-1.175,2.431,2.431,0,0,0,0-2.424Zm5.93,14.649a.312.312,0,0,1-.276.173H15.335a.312.312,0,0,1-.276-.173.412.412,0,0,1,0-.424l7.668-13.231A.305.305,0,0,1,23,16a.309.309,0,0,1,.277.176L30.942,29.4A.41.41,0,0,1,30.941,29.827Z" fill="#FFFFFF" ></path><path d="M25.011,35.178a2.3,2.3,0,0,0-4.019,0L13.327,48.4a2.433,2.433,0,0,0,0,2.425A2.3,2.3,0,0,0,15.335,52h15.33a2.3,2.3,0,0,0,2.01-1.175,2.431,2.431,0,0,0,0-2.424Zm5.93,14.649a.312.312,0,0,1-.276.173H15.335a.312.312,0,0,1-.276-.173.412.412,0,0,1,0-.424l7.668-13.231A.305.305,0,0,1,23,36a.309.309,0,0,1,.277.176L30.942,49.4A.41.41,0,0,1,30.941,49.827Z" fill="#FFFFFF" ></path><path d="M52,3H39a3,3,0,0,0-3-3H24a3,3,0,0,0-3,3H8A3,3,0,0,0,5,6V57a3,3,0,0,0,3,3H52a3,3,0,0,0,3-3V6A3,3,0,0,0,52,3ZM49,47H44a2,2,0,0,0-2,2v5H11V9H21.184A3,3,0,0,0,24,11H36a3,3,0,0,0,2.816-2H49Zm-1.414,2L44,52.586V49ZM23,3a1,1,0,0,1,1-1H36a1,1,0,0,1,1,1V8a1,1,0,0,1-1,1H24a1,1,0,0,1-1-1ZM53,57a1,1,0,0,1-1,1H8a1,1,0,0,1-1-1V6A1,1,0,0,1,8,5H21V7H11A2,2,0,0,0,9,9V54a2,2,0,0,0,2,2H42.586A2.015,2.015,0,0,0,44,55.414L50.414,49A2.015,2.015,0,0,0,51,47.586V9a2,2,0,0,0-2-2H39V5H52a1,1,0,0,1,1,1Z" fill="#FFFFFF" ></path><path d="M23,19a1,1,0,0,0-1,1v3a1,1,0,0,0,2,0V20A1,1,0,0,0,23,19Z" fill="#FFFFFF" ></path><path d="M23,25.594a1,1,0,0,0-1,1V27a1,1,0,0,0,2,0v-.406A1,1,0,0,0,23,25.594Z" fill="#FFFFFF" ></path><path d="M23,39a1,1,0,0,0-1,1v3a1,1,0,0,0,2,0V40A1,1,0,0,0,23,39Z" fill="#FFFFFF" ></path><path d="M23,45.594a1,1,0,0,0-1,1V47a1,1,0,0,0,2,0v-.406A1,1,0,0,0,23,45.594Z" fill="#FFFFFF" ></path><path d="M35,16a1,1,0,0,0,0,2H45a1,1,0,0,0,0-2Z" fill="#FFFFFF" ></path><path d="M45,20H35a1,1,0,0,0,0,2H45a1,1,0,0,0,0-2Z" fill="#FFFFFF" ></path><path d="M35,26h5a1,1,0,0,0,0-2H35a1,1,0,0,0,0,2Z" fill="#FFFFFF" ></path><path d="M45,36H35a1,1,0,0,0,0,2H45a1,1,0,0,0,0-2Z" fill="#FFFFFF" ></path><path d="M45,40H35a1,1,0,0,0,0,2H45a1,1,0,0,0,0-2Z" fill="#FFFFFF" ></path><path d="M40,44H35a1,1,0,0,0,0,2h5a1,1,0,0,0,0-2Z" fill="#FFFFFF" ></path></g></svg>,
}




const IncidentsCenter = () => {

  const requestsNoAdmin = [
    {icon: icons.CreateInvoiceRequest, isLink: false, to: '/incidents-center/my-reports', bgColor: '#9922FF', text: 'My Requests'},
    {icon: icons.CreateInvoiceRequest, isLink: false, to: '/incidents-center/assigned-reports', bgColor: '#3366FF', text: 'Assigned To Me'},

  ];
  const requestsAdmin = [
    {icon: icons.CreateInvoiceRequest, isLink: false, to: '/incidents-center/request-for-review', bgColor: '#FFaa00', text: 'Requests For Review'},
  ];

  return (
    <>
      <HistoryNavigation>
        <p>Risk Center</p>
      </HistoryNavigation>
      <div className='standard-page'>
        <ServicesSection
          title="Operational Risk Management"
          items={[
            {icon: icons.NewMeeting, isLink: false, to: '/incidents-center/new-report', bgColor: '#FF6699', text: 'New Incident Report'},
          ]}
        />
        <ServicesSection
          title="Request Center"
          items={
            // isAdmin ? 
              [...requestsNoAdmin, ...requestsAdmin]
            // : [...requestsNoAdmin]
          }
        />
      </div>
    </>
  )
}

export default IncidentsCenter