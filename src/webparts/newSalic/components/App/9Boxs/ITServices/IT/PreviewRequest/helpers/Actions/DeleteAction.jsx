import React, { useState } from 'react';
import { message, Modal, notification, Typography } from 'antd';
import DeleteSeriveRequest from '../../../../API/DeleteSeriveRequest';
import { DeleteOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';


function DeleteAction({ openModal, RequestId, handelAfterAction, onCancel }) {
  const [btnLoading, setBtnLoading] = useState(false);
  const [reasonValue, setReasonValue] = useState('');
  const [isShowing, setIsShowing] = useState(true);
  
  
  const deleteAction = async () => {
    setBtnLoading(true);
    if(reasonValue.length >= 3) {
      await DeleteSeriveRequest(RequestId, reasonValue);
      if(handelAfterAction) handelAfterAction();
      notification.success({message: 'Service request has been deleted successfully'});
      setReasonValue(false);
      setIsShowing(false);
    } else {
      message.error("Please, write reason of canceled");
    }
    setBtnLoading(false);
  }
  return (
    <>
      {isShowing && (
        <Modal
          title={<><DeleteOutlined /> Cancel Request #{RequestId}</>}
          open={openModal} 
          onOk={deleteAction} 
          cancelButtonProps={{style: {display: 'none'}}}
          onCancel={onCancel}
          okButtonProps={{type: 'primary', disabled: btnLoading}} 
          okText="Cancel Request"
          destroyOnClose
        >
          <div>
            <Typography.Text strong>Write Cancel Reason</Typography.Text>
            <TextArea rows={4} placeholder="write here" value={reasonValue} onChange={e => setReasonValue(e.target.value)} />
          </div>
        </Modal>
      )}
    </>
  )
}

export default DeleteAction