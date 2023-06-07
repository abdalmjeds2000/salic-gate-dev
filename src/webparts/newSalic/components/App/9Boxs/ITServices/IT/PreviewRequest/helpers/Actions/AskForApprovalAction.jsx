import React, { useContext, useState } from 'react';
import { Button, Form, Modal, message, notification } from 'antd';
import { PullRequestOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import { AppCtx } from '../../../../../../App';
import DropdownSelectUser from '../../../../../../Global/DropdownSelectUser/DropdownSelectUser';
import axios from 'axios';


function AskForApprovalAction({ RequestId, handelAfterAction, openModal, onCancel }) {
  const { user_data } = useContext(AppCtx);
  const [form] = Form.useForm();
  const [btnLoading, setBtnLoading] = useState(false);
  
  
  const handleAskForApproval = async (form_data) => {
    setBtnLoading(true);
      const payload = { 
        ServiceRequestId: RequestId,
        Email: user_data.Data.Mail,
        ...form_data 
      };
      console.log(payload);
      // await axios.post('https://dev.salic.com/api/tracking/AskForApproval', payload);
      if(handelAfterAction) handelAfterAction();
      notification.success({message: 'Done!' });
      form.resetFields();
      onCancel();
    setBtnLoading(false);
  }
  return (
      <Modal
        title={<><PullRequestOutlined /> Ask For Approval #{RequestId}</>}
        open={openModal} 
        onCancel={onCancel}
        footer={null}
      >
        <Form form={form} layout='vertical' onFinish={handleAskForApproval} onFinishFailed={() => message.error('Please, Fill all required fields!')}>
          <Form.Item label="Approver" required>
            <DropdownSelectUser name="ApproverEmail" size="large" placeholder="Select Approver" required={true} />
          </Form.Item>
          <Form.Item label="Notes" name="Notes" rules={[{ required: true, message: false }]}>
            <TextArea placeholder="Enter a Notes" rows={4} size='large' />
          </Form.Item>
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-end' }}>
            <Button type="primary" htmlType="submit" loading={btnLoading}>Submit</Button>
            <Button type="default" onClick={onCancel}>Cancel</Button>
          </div>
        </Form>
      </Modal>
  )
}

export default AskForApprovalAction