import React from 'react';
import { Form, Select } from 'antd';


const InstallProgramToolFields = () => {
  return (
    <Form.Item label='Programs' name="NewProgramsList">
      <Select mode="tags" placeholder='enter needed programs' />
    </Form.Item>
  )
}

export default InstallProgramToolFields