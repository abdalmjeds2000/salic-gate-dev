import React, { useContext, useEffect, useState } from 'react';
import { AppCtx } from '../App';
import pnp from 'sp-pnp-js';


const useIsAdmin = (groupname) => {
  const { user_data } = useContext(AppCtx);
  const [admins, setAdmins] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const fetchAdmins = async (gName) => {
    const groupName = gName;
    const users = await pnp.sp.web.siteGroups.getByName(groupName).users.get();
    setAdmins(users);
    return users;
  };

  const checkIsAdmin = async (gName) => {
    const users = await fetchAdmins(gName);

    users.map(user => {
      if(user?.Email?.toLowerCase() === user_data?.Data?.Mail?.toLowerCase()) {
        setIsAdmin(true);
      }
    });
    return isAdmin;
  };

  useEffect(() => {
    if(Object.keys(user_data).length > 0) {
      checkIsAdmin(groupname);
    }
  }, [user_data]);

  return [isAdmin, checkIsAdmin, admins, fetchAdmins];
};

export default useIsAdmin