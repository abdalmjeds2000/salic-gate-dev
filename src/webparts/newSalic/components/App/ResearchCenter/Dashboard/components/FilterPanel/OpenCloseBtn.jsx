import React from 'react';
import { CloseOutlined, FilterOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';

function OpenCloseBtn(props) {

  return (
    <div className='mobile-filter-icon'>
      <Tooltip title={!props.openFilterPanel ? "Open Filter Panel" : "Close Filter Panel"}>
        <Button 
          type="primary" 
          shape="circle" 
          icon={!props.openFilterPanel ? <FilterOutlined /> : <CloseOutlined />} 
          onClick={props.onClick} 
        />
      </Tooltip>
    </div>
  )
}

export default OpenCloseBtn