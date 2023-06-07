import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppCtx } from '../../App/App';
import pnp from 'sp-pnp-js';



const ProtectRouteIT = (props) => {
  const { user_data, defualt_route } = useContext(AppCtx);
  let navigate = useNavigate();
  const [ITAdmins, setITAdmins] = useState([]);

  const fetchITAdmins = async () => {
    const groupName = 'IT_Admin';
    const users = await pnp.sp.web.siteGroups.getByName(groupName).users.get();
    setITAdmins(users);
  }
  useEffect(() => {
    if(Object.keys(user_data).length > 0) {
      fetchITAdmins();
    }
  }, [user_data])
  let isAdmin = false;
  ITAdmins.map(user => {
    if(user?.Email?.toLowerCase() === user_data?.Data?.Mail?.toLowerCase()) {
      isAdmin = true;
    }
  });


  if(!isAdmin && ITAdmins.length > 0) {
    navigate(defualt_route + '/services-requests')

    return <></>
  }
  return (
    <>
      {props.children}
    </>
  )
}

export default ProtectRouteIT