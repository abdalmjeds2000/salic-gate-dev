import React, { useState } from 'react';
import { Button, Tooltip } from 'antd';

const ToggleButton = (props) => {
  const [toggle, setToggle] = useState(false)

  const handleClick = () => {
    setToggle(prev => !prev);
    props.callback(toggle)
  }
  return (
    <Tooltip title={props.title} mouseEnterDelay={0.5}>
      <Button
        type={props.btnType ? props.btnType : 'primary'} 
        size={props.btnSize ? props.btnSize : 'middle'}
        /* shape='circle' */
        onClick={handleClick}
      >
        {props.icon}
      </Button>
    </Tooltip>
  )
}

export default ToggleButton