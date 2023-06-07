import React, { useState } from 'react';
import { Button, Col, Form, message, Row } from 'antd';
import DropdownSelectUser from '../Global/DropdownSelectUser/DropdownSelectUser';

const SelectUser = ({ loading }) => {
  const [form] = Form.useForm();

  return (
    <Form
      name="pick-user-notifications" 
      layout="vertical"
      form={form} 
      onFinish={v => console.log(v)}
      onFinishFailed={() => message.error("Pick a User First.")}
    >
    
    <Row gutter={10} justify="end">
      <Col>
        <Form.Item label="Select User">
          <DropdownSelectUser name="mail" placeholder="select user" required={true} style={{width: 250}} />
        </Form.Item>
      </Col>
      <Col>
        <Button htmlType='submit' disabled={loading}>Get Notifications</Button>
      </Col>
    </Row>
  </Form>
  )
}

export default SelectUser