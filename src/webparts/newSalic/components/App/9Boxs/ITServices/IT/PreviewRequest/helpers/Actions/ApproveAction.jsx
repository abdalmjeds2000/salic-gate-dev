import React, { useState } from 'react';
import { Popconfirm, notification } from 'antd';
import ApproveSeriveRequest from '../../../../API/ApproveSeriveRequest';
import RejectSeriveRequest from '../../../../API/RejectSeriveRequest';

export const ApproveAction = ({ children, ActionId, handelAfterAction }) => {

  const approveAction = async () => {
    await ApproveSeriveRequest(ActionId);
    notification.success({message: 'Service request has been accepted successfully'});
    if(handelAfterAction) handelAfterAction();
  }
  return (
    <Popconfirm
      placement="bottomRight"
      title="Are you sure to Approve this Request?"
      onConfirm={approveAction}
      okText="Approve"
      cancelText="Cancel"
    >
      {children}
    </Popconfirm>
  )
}
export const RejectAction = ({ children, ActionId, handelAfterAction }) => {

  const rejectAction = async () => {
    await RejectSeriveRequest(ActionId);
    notification.success({message: 'Service request has been rejected successfully'});
    if(handelAfterAction) handelAfterAction();
  }
  return (
    <Popconfirm
      placement="bottomRight"
      title="Are you sure to Reject this Request?"
      onConfirm={rejectAction}
      okText="Reject"
      cancelText="Cancel"
    >
      {children}
    </Popconfirm>
  )
}