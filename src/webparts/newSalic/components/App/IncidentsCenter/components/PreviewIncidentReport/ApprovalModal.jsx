import React, { useState, useContext } from 'react';
import { Button, Col, Form, message, Modal, notification, Row } from 'antd';
import { AppCtx } from '../../../App';
import { HiOutlineClipboardCheck } from 'react-icons/hi';
import AutoCompleteSelectUsers from '../../../Global/DropdownSelectUser/AutoCompleteSelectUsers';
import axios from 'axios';

function ApprovalModal({ id, onSuccess }) {
  const { user_data } = useContext(AppCtx);
  const [openModal, setOpenModal] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [isShowing, setIsShowing] = useState(true);
  const [form] = Form.useForm();


  const sendForApproval = async (values) => {
    setBtnLoading(true);
    const data = values;
    data.Approvals = data.Approvals.map(item => item.value).join();
    data.Email = user_data?.Data?.Mail;
    data.Id = id;
    const response = await axios({
      method: "POST",
      url: `https://dev.salic.com/api/Incidents/SendForApproval`,
      data: data,
    });
    if(response?.status == 200 || response?.status == 201) {
      onSuccess();
      setOpenModal(false);
      setIsShowing(false);
      notification.success({message: "Incident report has been sent for approval"})
    } else {
      notification.error({message: "failed"})
    }
    setBtnLoading(false);
  }

  return (
    <>
      {isShowing && <>
        <Button type='primary' loading={btnLoading} onClick={() => setOpenModal(true)}>Send For Approval</Button>
        <Modal 
          title={<><HiOutlineClipboardCheck /> Incident Report Approval Request</>}
          open={openModal} 
          onCancel={() => setOpenModal(false)}
          footer={null}
        >
          <Form
            name="incident-report-approval-request" 
            layout="vertical"
            form={form} 
            onFinish={sendForApproval}
            onFinishFailed={() => message.error("Please, fill out the form correctly.")}
          >
            <Form.Item label="Send Approval Request for">
              <AutoCompleteSelectUsers name="Approvals" size="large" isRequired={true} />
            </Form.Item>
            <Row gutter={10} justify="end">
              <Col>
                <Button htmlType='submit' type='primary' loading={btnLoading}>Send For Approval</Button>
              </Col>
              <Col>
                <Button onClick={() => setOpenModal(false)}>Cancel</Button>
              </Col>
            </Row>
          </Form>
        </Modal>
      </>}
    </>
  )
}

export default ApprovalModal