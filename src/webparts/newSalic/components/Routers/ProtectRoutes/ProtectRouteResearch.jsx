import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppCtx } from '../../App/App';
import pnp from 'sp-pnp-js';



const ProtectRouteResearch = (props) => {
  const { user_data, defualt_route } = useContext(AppCtx);
  let navigate = useNavigate();
  const [researchAdmins, setResearchAdmins] = useState([]);


  const fetchResearchAdmins = async () => {
    const groupName = 'Research_Admin';
    const users = await pnp.sp.web.siteGroups.getByName(groupName).users.get();
    setResearchAdmins(users);
  }
  useEffect(() => {
    if(Object.keys(user_data).length > 0) {
      fetchResearchAdmins();
    }
  }, [user_data])
  let isAdmin = false;
  researchAdmins.map(user => {
    if(user?.Email?.toLowerCase() === user_data?.Data?.Mail?.toLowerCase()) {
      isAdmin = true;
    }
  });


  if(!isAdmin && researchAdmins.length > 0) {
    navigate(defualt_route + '/research-library')

    return <></>
  }
  return (
    <>
      {props.children}
    </>
  )
}

export default ProtectRouteResearch