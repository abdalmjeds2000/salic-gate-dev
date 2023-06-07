import { Form, Input, Select } from 'antd';
import React, { useContext, useState } from 'react';
import DropdownSelectUser from '../../../../../../../../Global/DropdownSelectUser/DropdownSelectUser';
import { AppCtx } from '../../../../../../../../App';


const MASARFields = () => {
  const { salic_departments } = useContext(AppCtx);
  return (
    <>
      <Form.Item label="Email" required>
        <DropdownSelectUser 
          name="masar_email" 
          placeholder="Select User" 
          size="middle" 
          required
        />
      </Form.Item>

      <Form.Item label="Display Name" required>
        <DropdownSelectUser 
          name="masar_name" 
          placeholder="User Display Name" 
          size="middle" 
          required
          triggerDisplayName // to set value displayname not email
        />
      </Form.Item>

      <Form.Item name="masar_department" label="Department" rules={[{required: true, message: ''}]}>
        <Select placeholder="Select Department">
          {salic_departments?.map((item, index) => <Select.Option key={index} value={item}>{item}</Select.Option>)}
        </Select>
      </Form.Item>
    </>
  )
}

export default MASARFields