import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppCtx } from '../../App/App';
import pnp from 'sp-pnp-js';



const ProtectRouteContent = (props) => {
  const { user_data, defualt_route } = useContext(AppCtx);
  let navigate = useNavigate();
  const [admins, setAdmins] = useState([]);

  const fetchAttendanceAdmins = async () => {
    const groupName = 'Content_Admin';
    const users = await pnp.sp.web.siteGroups.getByName(groupName).users.get();
    setAdmins(users);
  }
  useEffect(() => {
    if(Object.keys(user_data).length > 0) {
      fetchAttendanceAdmins();
    }
  }, [user_data]);

  
  let isAdmin = false;
  admins.map(user => {
    if(user?.Email?.toLowerCase() === user_data?.Data?.Mail?.toLowerCase()) {
      isAdmin = true;
    }
  });


  if(!isAdmin && admins.length > 0) {
    navigate(defualt_route)

    return <></>
  }
  return (
    <>
      {props.children}
    </>
  )
}

export default ProtectRouteContent