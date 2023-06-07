import { CheckCircleOutlined, CloseCircleOutlined, SyncOutlined } from '@ant-design/icons'
import { Tag } from 'antd'
import React from 'react'

function StatusTag(props) {
  return (
    props.Status === "Approved" || props.Status === "Acknowledge"
      ? <Tag icon={<CheckCircleOutlined />} color="success">Approved</Tag>
    : props.Status === "Rejected"
      ? <Tag icon={<CloseCircleOutlined />} color="error">Rejected</Tag>
    : props.Status === "Cancel"
      ? <Tag icon={<CloseCircleOutlined />} color="error">Cancel</Tag>
    : <Tag icon={<SyncOutlined spin />} color="processing">Submitted</Tag>
  )
}

export default StatusTag