import { Form, Input } from 'antd';
import React from 'react';
import DropdownSelectUser from '../../../../../../../../Global/DropdownSelectUser/DropdownSelectUser';


const ChangeLineManagerFields = () => {
  return (
    <>

      <Form.Item label="Employee">
        <DropdownSelectUser name="Employee" placeholder="Select Employee" size="middle" />
      </Form.Item>

      <Form.Item name="NewLine" label="New Line Manager" rules={[{required: true, message: false}]}>
        <Input placeholder='Enter Group Name' />
      </Form.Item>

    </>
  )
}

export default ChangeLineManagerFields