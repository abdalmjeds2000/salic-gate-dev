import React from 'react';
import useIsAdmin from '../../App/Hooks/useIsAdmin';


const ProtectAdminDashboard = (props) => {
  const [isAdmin, checkIsAdmin, admins, fetchAdmins] = useIsAdmin("Admin Users")


  if(isAdmin && admins.length > 0) {
    return props.children
  }
  return <></>
}

export default ProtectAdminDashboard