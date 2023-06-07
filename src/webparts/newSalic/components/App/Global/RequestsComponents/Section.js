import React from "react";
import { Divider } from "antd";


const Section = (props) => {
  const AssigneeRecordsStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  }
  return (
    <div>
        <Divider orientation="left" orientationMargin="0" className={props.className} {...props?.rest}>
          {props.SectionTitle}
        </Divider>
        <div style={AssigneeRecordsStyle}>
          {props.children}
        </div>
    </div>
  )
}

export default Section