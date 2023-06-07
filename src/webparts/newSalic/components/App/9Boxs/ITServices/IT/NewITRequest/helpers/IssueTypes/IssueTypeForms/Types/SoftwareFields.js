import React from "react";
import { Form, Select } from "antd";

function SoftwareFields() {

  return (
    <>
      <Form.Item name="SoftwareName" label="Software Name" initialValue="Acrobat Reader Professional" rules={[{ required: true, message: false }]}>
        <Select>
          <Select.Option value="Acrobat Reader Professional">Acrobat Reader Professional</Select.Option>
          <Select.Option value="Thinkcell">Thinkcell</Select.Option>
          <Select.Option value="Power BI">Power BI</Select.Option>
          <Select.Option value="Grammerly">Grammerly</Select.Option>
        </Select>
      </Form.Item>
    </>
  );
}

export default SoftwareFields;
