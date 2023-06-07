import { Form } from 'antd';
import React from 'react';
import DropdownSelectUser from '../../../../../../../../Global/DropdownSelectUser/DropdownSelectUser';
import DropdownSelectUserNoLabel from '../../../../../../../../Global/DropdownSelectUser/DropdownSelectUserNoLabel';

const NewEmailAccountFields = () => {
  return (
    <>
      <Form.Item label="Name" required>
        <DropdownSelectUser 
          name="new_email_account_name" 
          placeholder="User Display Name" 
          size="middle" 
          required
          triggerDisplayName // to set value displayname not email
        />
      </Form.Item>

      <Form.Item label="Email" required>
        <DropdownSelectUser 
          name="new_email_account_email" 
          placeholder="Select User Email" 
          size="middle" 
          required
        />
      </Form.Item>

      <Form.Item label="Owner" required>
        <DropdownSelectUserNoLabel 
          name="new_email_account_owner" 
          placeholder="Select Owner Email" 
          size="middle" 
          required
        />
      </Form.Item>
    </>
  )
}

export default NewEmailAccountFields