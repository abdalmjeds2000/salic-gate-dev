import React from "react";
import { Form, Input, Select } from "antd";
import DropdownSelectUser from "../../../../../../../../Global/DropdownSelectUser/DropdownSelectUser";

function SharedEmailFields() {

  return (
    <>
      <Form.Item label="Business Owner">
        <DropdownSelectUser name="BusinessOwner" placeholder="Employee Name" required={true} isDisabled={false} />
      </Form.Item>
      <Form.Item name="SenderName" label="Email Name" rules={[{ required: true, message: false }]}>
        <Input placeholder="Sender Name" />
      </Form.Item>
      <Form.Item name="EmailAddress" label="Email Address" rules={[{ required: true, message: false }]}>
        <Input placeholder="email@salic.com" />
      </Form.Item>
      <Form.Item name="Members" label="Members" rules={[{ required: true, message: false }]}>
        <Select mode="tags" style={{width: '100%',}} placeholder="email@sali..., email@sali..., email@sali..." />
      </Form.Item>
    </>
  );
}

export default SharedEmailFields;
