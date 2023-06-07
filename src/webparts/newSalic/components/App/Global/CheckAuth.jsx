import React from 'react';
import { useEffect } from 'react';
import pnp from "sp-pnp-js";


const CheckAuth = (props) => {
  useEffect(() => {
    setInterval(async () => {
      await pnp.sp.web.lists.getByTitle('For Check Auth').items
      .get()
      .then(res => {
        return res
      })
      .catch((err) => {
        if(err.status == 403 || err.status == 401) {
          window.location.reload();
        }
      })
    }, 10000);
  }, [])

  return (
    <> {props.children} </>
  )
}

export default CheckAuth