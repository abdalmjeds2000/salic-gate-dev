import { Form, Input, Typography } from 'antd';
import React from 'react';
import AutoCompleteSelectUsers from '../../../../../../../../Global/DropdownSelectUser/AutoCompleteSelectUsers';


const AddUserstoAGroupFields = () => {

  return (
    <>

      <Form.Item name="GroupName" label="Group Name" rules={[{required: true, message: false}]}>
        <Input placeholder='Enter Group Name' />
      </Form.Item>

      <Form.Item name="EmailAddress" label="Email Address" rules={[{required: true, message: false}]}>
        <Input placeholder='Enter Email Address' />
      </Form.Item>

      <Form.Item label={<><Typography.Text type='danger' style={{padding: '0 2px'}}>*</Typography.Text> Members</>}>
        <AutoCompleteSelectUsers name="GroupMembers" isRequired={true} />
      </Form.Item>

    </>
  )
}

export default AddUserstoAGroupFields