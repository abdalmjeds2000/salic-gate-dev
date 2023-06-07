import React from 'react';
import useIsAdmin from '../../App/Hooks/useIsAdmin';

const ProtectRoutePowerBI = (props) => {
  const [isAdmin] = useIsAdmin("HR_Power_BI");

  if(isAdmin) {
    return props.children
  }
  return <></>
}

export default ProtectRoutePowerBI