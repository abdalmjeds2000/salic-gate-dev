import React from 'react';
import { Empty } from 'antd';

function EmptySection() {
  return (
    <Empty style={{backgroundColor: '#fff', margin: 0, padding: '25px 0'}} image={Empty.PRESENTED_IMAGE_SIMPLE} />
  )
}

export default EmptySection