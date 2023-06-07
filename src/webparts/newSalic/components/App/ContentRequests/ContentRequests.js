import React, { useContext, useEffect, useState } from "react";
import { AppCtx } from "../App";
import HistoryNavigation from "../Global/HistoryNavigation/HistoryNavigation";
import ServicesSection from "../Global/ServicesSection/ServicesSection";
import pnp from 'sp-pnp-js';


function ContentRequests() {
  const { user_data } = useContext(AppCtx);
  const [admins, setAdmins] = useState([]);


  const srvsIcons = {
    iTServices: <svg id="Group_42" data-name="Group 42" xmlns="http://www.w3.org/2000/svg" width="29.851" height="37.608" viewBox="0 0 29.851 37.608"><g id="Group_41" data-name="Group 41"><path id="Path_4767" data-name="Path 4767" d="M80.7,11.2H77.16c.012-.008.023-.017.036-.024l.951-.549a2.3,2.3,0,0,0,.833-3.108L77.207,4.45A2.278,2.278,0,0,0,74.1,3.617l-.952.549a.941.941,0,0,1-1.374-.793v-1.1A2.278,2.278,0,0,0,69.5,0H65.953a2.278,2.278,0,0,0-2.275,2.275v1.1a.942.942,0,0,1-1.374.793l-.952-.549a2.278,2.278,0,0,0-3.108.833L56.472,7.521a2.278,2.278,0,0,0,.833,3.108l.951.549c.013.007.024.016.036.024H54.749A1.951,1.951,0,0,0,52.8,13.151V30.465a1.952,1.952,0,0,0,1.949,1.949h9.2L63.637,35.1a1.167,1.167,0,0,1-1.161,1.036c-.016,0-.031,0-.047,0h-.738a.735.735,0,0,0,0,1.469H73.76a.735.735,0,0,0,0-1.469h-.738a.4.4,0,0,0-.047,0A1.167,1.167,0,0,1,71.814,35.1L71.5,32.415h9.2a1.952,1.952,0,0,0,1.949-1.949V13.151A1.951,1.951,0,0,0,80.7,11.2ZM64.841,36.139a2.631,2.631,0,0,0,.255-.87l.333-2.854h4.594l.333,2.854a2.635,2.635,0,0,0,.256.87h-5.77Zm1.142-23.583h3.486a.735.735,0,0,0,.735-.735V8.474a4.34,4.34,0,0,1,1.841,3.537,4.322,4.322,0,0,1-2.567,3.948.735.735,0,0,0-.414.85L70.3,21.743a.814.814,0,0,1-.8.73H65.952a.814.814,0,0,1-.8-.73l1.237-4.935a.734.734,0,0,0-.414-.85,4.319,4.319,0,0,1-.725-7.485v3.348a.735.735,0,0,0,.735.735Zm-7.944-3.2a.807.807,0,0,1-.3-1.1l1.773-3.071a.807.807,0,0,1,1.1-.3l.952.549a2.422,2.422,0,0,0,3.577-2.065v-1.1a.807.807,0,0,1,.806-.806H69.5a.807.807,0,0,1,.806.806v1.1a2.422,2.422,0,0,0,3.577,2.065l.952-.549a.807.807,0,0,1,1.1.3l1.773,3.071a.814.814,0,0,1-.295,1.1l-.951.549a2.346,2.346,0,0,0-1.17,1.988,2.37,2.37,0,0,0,1.17,2.144l.951.549a.814.814,0,0,1,.3,1.1l-1.773,3.071a.814.814,0,0,1-1.1.295l-.952-.549a2.408,2.408,0,0,0-2.8.325l-.454-1.811a5.789,5.789,0,0,0-.908-10.44.735.735,0,0,0-.988.689v3.82H66.717V7.267a.735.735,0,0,0-.988-.689,5.79,5.79,0,0,0-.908,10.441l-.454,1.811a2.407,2.407,0,0,0-2.8-.325l-.952.55a.817.817,0,0,1-1.1-.295l-1.773-3.071a.814.814,0,0,1,.295-1.1l.951-.549a2.373,2.373,0,0,0,1.17-2.14A2.347,2.347,0,0,0,58.99,9.906ZM81.182,30.465a.481.481,0,0,1-.48.48H54.749a.481.481,0,0,1-.48-.48V28.559h10.1a.735.735,0,0,0,0-1.469h-10.1V13.151a.481.481,0,0,1,.48-.48h3.635a.69.69,0,0,1-.129.094l-.951.549a2.3,2.3,0,0,0-.833,3.108l1.773,3.071a2.3,2.3,0,0,0,3.108.833l.952-.549a.942.942,0,0,1,1.374.793v1.1a2.3,2.3,0,0,0,2.275,2.275H69.5a2.3,2.3,0,0,0,2.275-2.275v-1.1a.942.942,0,0,1,1.374-.793l.951.549a2.3,2.3,0,0,0,3.108-.832l1.773-3.071a2.3,2.3,0,0,0-.833-3.108l-.951-.549a.709.709,0,0,1-.129-.094H80.7a.481.481,0,0,1,.48.48V27.09H70.854a.735.735,0,1,0,0,1.469H81.182Z" transform="translate(-52.8)" fill="#fff"/><path id="Path_4768" data-name="Path 4768" d="M246.434,369.39a.734.734,0,1,0-.3.909A.74.74,0,0,0,246.434,369.39Z" transform="translate(-230.904 -341.847)" fill="#fff"/></g></svg>,
    myRequest: <svg id="Group_312" data-name="Group 312" xmlns="http://www.w3.org/2000/svg" width="33.204" height="33.203" viewBox="0 0 33.204 33.203"><path id="Path_4986" data-name="Path 4986" d="M191.155,115.625h6.178a.973.973,0,0,0,0-1.946h-6.178a.973.973,0,0,0,0,1.946Z" transform="translate(-177.849 -106.307)" fill="#fff"/><path id="Path_4987" data-name="Path 4987" d="M23.737,0H.973A.973.973,0,0,0,0,.973V32.231a.973.973,0,0,0,.973.973H23.737a.973.973,0,0,0,.973-.973V.973A.973.973,0,0,0,23.737,0Zm-.973,31.258H1.946V1.946H22.765Z" fill="#fff"/><path id="Path_4988" data-name="Path 4988" d="M416.78,23.573V3.3a3.3,3.3,0,0,0-6.6,0V23.573a.972.972,0,0,0,.885.968l-.827,2.284a.973.973,0,0,0,.031.737l2.329,5.074a.973.973,0,0,0,1.768,0l2.329-5.074a.973.973,0,0,0,.031-.737l-.827-2.284A.972.972,0,0,0,416.78,23.573Zm-4.658-.973V8.1h2.712V22.6h-2.712Zm1.356-20.655A1.358,1.358,0,0,1,414.834,3.3V6.155h-2.712V3.3A1.358,1.358,0,0,1,413.478,1.946Zm0,27.953L412.2,27.113l.929-2.567h.7l.929,2.567Z" transform="translate(-383.576)" fill="#fff"/><path id="Path_4989" data-name="Path 4989" d="M66.512,90.644a.973.973,0,0,0,1.376,0l2.955-2.955a.973.973,0,0,0-1.376-1.376L67.2,88.58l-.7-.7a.973.973,0,0,0-1.376,1.376Z" transform="translate(-60.63 -80.45)" fill="#fff"/><path id="Path_4990" data-name="Path 4990" d="M191.155,206.63h6.178a.973.973,0,1,0,0-1.945h-6.178a.973.973,0,1,0,0,1.945Z" transform="translate(-177.849 -191.41)" fill="#fff"/><path id="Path_4991" data-name="Path 4991" d="M66.512,181.648a.973.973,0,0,0,1.376,0l2.955-2.955a.973.973,0,0,0-1.376-1.376L67.2,179.584l-.7-.7a.973.973,0,1,0-1.376,1.376Z" transform="translate(-60.63 -165.552)" fill="#fff"/><path id="Path_4992" data-name="Path 4992" d="M191.155,297.633h6.178a.973.973,0,1,0,0-1.945h-6.178a.973.973,0,1,0,0,1.945Z" transform="translate(-177.849 -276.512)" fill="#fff"/><path id="Path_4993" data-name="Path 4993" d="M191.155,392.124h6.178a.973.973,0,0,0,0-1.946h-6.178a.973.973,0,0,0,0,1.946Z" transform="translate(-177.849 -364.875)" fill="#fff"/><path id="Path_4994" data-name="Path 4994" d="M66.512,272.654a.973.973,0,0,0,1.376,0l2.955-2.955a.973.973,0,0,0-1.376-1.376L67.2,270.591l-.7-.7a.973.973,0,0,0-1.376,1.376Z" transform="translate(-60.63 -250.656)" fill="#fff"/></svg>,
    contentRequests: <svg id="Group_316" data-name="Group 316" xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38"><path id="Path_4995" data-name="Path 4995" d="M10.683,251.525a5.883,5.883,0,1,0-7.215,0A7.068,7.068,0,0,0,0,257.615V260a1.113,1.113,0,0,0,1.113,1.113H13.038A1.113,1.113,0,0,0,14.151,260v-2.385A7.068,7.068,0,0,0,10.683,251.525Zm-7.264-4.642a3.657,3.657,0,1,1,3.657,3.657A3.661,3.661,0,0,1,3.419,246.883Zm8.506,12h-9.7v-1.272a4.849,4.849,0,0,1,9.7,0v1.272Z" transform="translate(0 -223.113)" fill="#fff"/><path id="Path_4996" data-name="Path 4996" d="M211.8,0H197.492A4.688,4.688,0,0,0,192.8,4.691V26.155a1.114,1.114,0,0,0,1.781.891l4.473-3.355H211.8A4.688,4.688,0,0,0,216.492,19V4.691A4.688,4.688,0,0,0,211.8,0Zm2.464,19a2.462,2.462,0,0,1-2.464,2.464H198.684a1.115,1.115,0,0,0-.668.223l-2.988,2.241V4.691a2.462,2.462,0,0,1,2.464-2.464H211.8a2.462,2.462,0,0,1,2.464,2.464Z" transform="translate(-178.492)" fill="#fff"/><path id="Path_4997" data-name="Path 4997" d="M270.1,80.332H258.179a1.113,1.113,0,0,0,0,2.227H270.1a1.113,1.113,0,0,0,0-2.227Z" transform="translate(-237.987 -74.37)" fill="#fff"/><path id="Path_4998" data-name="Path 4998" d="M270.1,144.6H258.179a1.113,1.113,0,0,0,0,2.227H270.1a1.113,1.113,0,0,0,0-2.227Z" transform="translate(-237.987 -133.87)" fill="#fff"/><path id="Path_4999" data-name="Path 4999" d="M264.141,208.867h-5.962a1.113,1.113,0,0,0,0,2.227h5.962a1.113,1.113,0,0,0,0-2.227Z" transform="translate(-237.987 -193.365)" fill="#fff"/></svg>,
  }
  
  const fetchAdmins = async () => {
    const groupName = 'Content_Admin';
    const users = await pnp.sp.web.siteGroups.getByName(groupName).users.get();
    setAdmins(users);
  }
  useEffect(() => {
    if(Object.keys(user_data).length > 0) {
      fetchAdmins();
    }
  }, [user_data])
  let isAdmin = false;
  admins.map(user => {
    if(user?.Email?.toLowerCase() === user_data?.Data?.Mail?.toLowerCase()) {
      isAdmin = true;
    }
  });





  const services = [
    {icon: srvsIcons.iTServices, isLink: false, to: '/content-requests/new-request', bgColor: '#70CFAF', text: 'New Content Request'},
  ];

  const ContentRequestsNoAdmin = [
    {icon: srvsIcons.myRequest, isLink: false, to: '/content-requests/my-content-requests', bgColor: '#43A2CC', text: 'My Requests'},
  ];
  const ContentRequestsAdmin = [
    {icon: srvsIcons.contentRequests, isLink: false, to: '/content-requests/all-content-requests', bgColor: '#FD96A6', text: 'Content Requests'},
  ];






  return (
    <>
      <HistoryNavigation>
        <p>Content Requests</p>
      </HistoryNavigation>

      <div className='standard-page'>
        <ServicesSection
          title="Content Requests"
          headerIcon={<div style={{backgroundColor: '#897ED4'}}>{srvsIcons.iTServices}</div>}
          items={services}
        />
        <ServicesSection
          title="Request Center"
          items={
            isAdmin
            ? [
                ...ContentRequestsNoAdmin,
                ...ContentRequestsAdmin
              ]
            : [
                ...ContentRequestsNoAdmin,
              ]
          }
        />
      </div>
    </>
  )
}

export default ContentRequests