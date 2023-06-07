import React, { useContext, useState } from 'react';
import { message, Modal, Space, Typography } from 'antd';
import ReOpenSeriveRequest from '../../../../API/ReOpenSeriveRequest';
import { RedoOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import { AppCtx } from '../../../../../../App';


function ReOpenAction({ RequestId, handelAfterAction, openModal, onCancel }) {
  const { user_data } = useContext(AppCtx);
  const [btnLoading, setBtnLoading] = useState(false);
  const [isShowing, setIsShowing] = useState(true);
  const [reOpenReason, setReOpenReason] = useState("");

  const reOpenAction = async () => {
    setBtnLoading(true);
    const payload = {
      Email: user_data.Data?.Mail,
      reopen_reason: reOpenReason,
      ServiceRequestId: RequestId,
    };
    if(reOpenReason.length > 0) {
      await ReOpenSeriveRequest(payload);
      message.success("Service request has been re-opened")
      handelAfterAction();
      setIsShowing(false);
    } else {
      message.error("Write Re-Open Reason")
    }
    setBtnLoading(false);
  }

  return (
    <>
      {isShowing && (
        <Modal 
          title={<><RedoOutlined /> Re Open Service Request</>}
          open={openModal} 
          onOk={reOpenAction} 
          onCancel={onCancel}
          okButtonProps={{type: 'primary', disabled: btnLoading}} 
          okText="Re-Open"
        >
          <Space direction='vertical' style={{width: '100%', gap: '25px'}}>
            <Typography.Text strong>HelpDesk Technical Feedback</Typography.Text>
            <TextArea rows={4} placeholder="HelpDesk Technical Feedback" value={reOpenReason} onChange={e => setReOpenReason(e.target.value)} />
          </Space>
        </Modal>
      )}
    </>
  )
}

export default ReOpenAction