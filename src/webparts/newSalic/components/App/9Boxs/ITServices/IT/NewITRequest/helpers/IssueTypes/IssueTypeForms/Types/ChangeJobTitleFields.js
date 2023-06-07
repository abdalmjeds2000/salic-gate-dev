import React from 'react';
import { Form, Input } from 'antd';
import DropdownSelectUser from '../../../../../../../../Global/DropdownSelectUser/DropdownSelectUser';


const ChangeJobTitleFields = () => {
  
  return (
    <>

      <Form.Item label="Employee">
        <DropdownSelectUser name="Employee" placeholder="Select Employee" size="middle" />
      </Form.Item>

      <Form.Item name="NewTitle" label="New Title" rules={[{required: true, message: false}]}>
        <Input placeholder='Enter Group Name' />
      </Form.Item>

    </>
  )
}

export default ChangeJobTitleFields