import React, { useState } from 'react';
import { Button, message, Modal, Select, Typography } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import useIsAdmin from '../../../Hooks/useIsAdmin';
import HoldActionRequest from './HoldActionRequest';
import TextArea from 'antd/lib/input/TextArea';


function HoldAction({ RequestId, RequestType, onSuccess }) {
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isShowing, setIsShowing] = useState(true);
  const [commentVal, setCommentVal] = useState("");
  // const [isAdmin, checkIsAdmin, admins, fetchAdmins] = useIsAdmin("Admin Users");

  const holdAction = async () => {
    setLoading(true);
    if(commentVal.length > 0) {
      const payload = {
        Id: RequestId,
        Notes: commentVal
      };
      var form_data = new FormData();
      for(let key in payload) {
        form_data.append(key, payload[key]);
      }
      const response = await HoldActionRequest(RequestType, form_data);
      console.log(response);
      if(response) {
        message.success("Admin Service Request has Hold");
        onSuccess();
        setIsShowing(false);
        setCommentVal("");
        setOpenModal(false);
      } else {
        message.error("Failed Hold Action")
      }
    } else {
      message.error("Write a Note First!")
    }
    setLoading(false);
  }

  return (
    <>
      {isShowing && <>
        <Button type='primary' onClick={() => setOpenModal(true)} className='ant-btn-warning'>Hold</Button>
        <Modal 
          title={<><SendOutlined /> Hold Admin Service Request</>}
          open={openModal} 
          onCancel={() => setOpenModal(false)}
          footer={[
            <Button type='primary' loading={loading} onClick={holdAction} className='ant-btn-warning'>
              Hold
            </Button>,
            <Button onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
          ]}
        >
          <Typography.Text strong><span style={{color: "red"}}>*{' '}</span>Leave a notes</Typography.Text>
          <TextArea rows={6} maxLength={10000} value={commentVal} placeholder="write a notes" onChange={(e) => setCommentVal(e.target.value)} />
        </Modal>
      </>}
    </>
  )
}

export default HoldAction