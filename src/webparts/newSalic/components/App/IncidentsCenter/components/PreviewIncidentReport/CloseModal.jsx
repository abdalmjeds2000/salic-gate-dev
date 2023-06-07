import React, { useState, useContext } from 'react';
import { Button, Col, Form, Input, message, Modal, notification, Row } from 'antd';
import { AppCtx } from '../../../App';
import { HiOutlineClipboardCheck } from 'react-icons/hi';
import axios from 'axios';

function CloseModal({ id, onSuccess }) {
  const { user_data } = useContext(AppCtx);
  const [openModal, setOpenModal] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [isShowing, setIsShowing] = useState(true);
  const [form] = Form.useForm();


  const closeIncidentReport = async (values) => {
    setBtnLoading(true);
    const data = values;
    values.Email = user_data?.Data?.Mail;
    values.Incident_Id = id;
    const response = await axios({
      method: "POST",
      url: `https://dev.salic.com/api/Incidents/CloseIncidentReport`,
      data: data,
    });
    if(response?.status == 200 || response?.status == 201) {
      setOpenModal(false);
      setIsShowing(false);
      notification.success({message: "Incident report has been closed"})
      onSuccess();
    } else {
      notification.error({message: "failed"})
    }
    setBtnLoading(false);
  }

  return (
    <>
      {isShowing && <>
        <Button type='primary' danger onClick={() => setOpenModal(true)}>Close</Button>
        <Modal 
          title={<><HiOutlineClipboardCheck /> Close Incident Report</>}
          open={openModal} 
          onCancel={() => setOpenModal(false)}
          footer={null}
        >
          <Form
            name="incident-report-close-request" 
            layout="vertical"
            form={form} 
            onFinish={closeIncidentReport}
            onFinishFailed={() => message.error("Please, fill out the form correctly.")}
          >
            <Form.Item name="close_feedback" label="Risk Management Feedback" rules={[{required: true}]}>
              <Input.TextArea size='large' rows={6} placeholder="write here" />
            </Form.Item>
            <Row gutter={10} justify="end">
              <Col>
                <Button htmlType='submit' danger type='primary' loading={btnLoading}>Close</Button>
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

export default CloseModal