import React, { useState } from 'react';
import { Button, notification, Popconfirm } from 'antd';
import RejectSeriveRequest from '../../../API/RejectSeriveRequest';
import ApproveSeriveRequest from '../../../API/ApproveSeriveRequest';

function ApproveAction(props) {
  const [btnLoading, setBtnLoading] = useState(false);
  const [isShowing, setIsShowing] = useState(true);

  const approveAction = async (status) => {
    setBtnLoading(true);
    if(status === "APPROVED") {
      const ApproveResponse = await ApproveSeriveRequest(props.ActionId);
      notification.success({message: 'Service request has been accepted successfully'});
    } else if(status === "REJECTED") {
      const RejectResponse = await RejectSeriveRequest(props.ActionId);
      notification.success({message: 'Service request has been rejected successfully'});
    }

    props.handelAfterAction();
    setIsShowing(false);
    setBtnLoading(false);
  }

  return (
    <>
      {isShowing && <>
        <Popconfirm
          placement="bottomRight"
          title="Are you sure to Approve this Request?"
          onConfirm={() => approveAction("APPROVED")}
          okText="Approve"
          cancelText="Cancel"
        >
          <Button disabled={btnLoading} size="middle" type='default'>Approve</Button>
        </Popconfirm>

        <Popconfirm
          placement="bottomRight"
          title="Are you sure to Reject this Request?"
          onConfirm={() => approveAction("REJECTED")}
          okText="Reject"
          okButtonProps={{danger: true}}
          cancelText="Cancel"
        >
          <Button disabled={btnLoading} size="middle" type='primary' danger>Reject</Button>
        </Popconfirm>
      </>}
    </>
  )
}

export default ApproveAction