import React from 'react';
import useIsAdmin from '../../App/Hooks/useIsAdmin';



const ProtectITActions = (props) => {
  const [isItAdmin] = useIsAdmin("IT_Admin");

  if(isItAdmin) {
    return props.children
  }
  return <></>
}

export default ProtectITActions