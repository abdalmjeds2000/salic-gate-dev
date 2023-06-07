import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin, Typography } from 'antd';


const AntdLoader = ({ customStyle, label }) => {

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '100px 0 25px 0', width: '100%', ...customStyle}}>
      <Spin indicator={<LoadingOutlined spin />} />
      <Typography.Text style={{color: 'var(--link-text-color)', fontSize: '.8rem'}}>{label || "Loading..."}</Typography.Text>
    </div>
  )
}

export default AntdLoader;