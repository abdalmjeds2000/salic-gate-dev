import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppCtx } from '../../App/App';
import pnp from 'sp-pnp-js';



const ProtectRouteCommunication = (props) => {
  const { user_data, defualt_route } = useContext(AppCtx);
  let navigate = useNavigate();
  const [communicationAdmins, setCommunicationAdmins] = useState([]);


  const fetchCommunicationAdmins = async () => {
    const groupName = 'Communication_Admin';
    const users = await pnp.sp.web.siteGroups.getByName(groupName).users.get();
    setCommunicationAdmins(users);
  }
  useEffect(() => {
    if(Object.keys(user_data).length > 0) {
      fetchCommunicationAdmins();
    }
  }, [user_data])
  let isAdmin = false;
  communicationAdmins.map(user => {
    if(user?.Email?.toLowerCase() === user_data?.Data?.Mail?.toLowerCase()) {
      isAdmin = true;
    }
  });


  if(!isAdmin && communicationAdmins.length > 0) {
    navigate(defualt_route + '/home')

    return <></>
  }
  return (
    <>
      {props.children}
    </>
  )
}

export default ProtectRouteCommunication