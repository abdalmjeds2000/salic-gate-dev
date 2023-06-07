import React, { useState } from "react";
import { Form, Input, Radio, Select, Space } from "antd";
import { Mapping_under_FSLI } from "../../it_json";

function GLAccountFields() {

  const [values, setValues] = useState([]);
  const handleFinancialStatementChange = (value) => {
    let values = Mapping_under_FSLI.filter(r => r.FinancialStatement == value );
    setValues(values)
  }
  return (
    <div className="new-account-fields-container">
      <Form.Item name="AccountType" label="Account Type" rules={[{ required: true, message: '' }]}>
        <Radio.Group>
          <Space direction="vertical">
            <Radio value="Asset">Asset</Radio>
            <Radio value="Liability">Liability</Radio>
            <Radio value="Expenses">Expenses</Radio>
            <Radio value="Revenue">Revenue</Radio>
            <Radio value="OwnerEquity">Owner's Equity</Radio>
          </Space>
        </Radio.Group>
      </Form.Item>

      <Form.Item label="Account Information" rules={[{ required: true, message: '' }]}>
        <Form.Item rules={[{ required: true }]}>
          <span style={{display: 'inline-block', width: 'calc(50% - 5px)'}}>Account Code</span>
          <span style={{display: 'inline-block', width: 'calc(50% - 5px)', margin: '0 0 0 10px'}}>Account Description</span>
          <Form.Item name="AccountCode" rules={[{ required: true, message: '' }]} style={{ display: 'inline-block', width: 'calc(50% - 5px)' }} >
            <Input placeholder="Write Here" />
          </Form.Item>
          <Form.Item name="AccountDescription" rules={[{ required: true, message: '' }]} style={{ display: 'inline-block', width: 'calc(50% - 5px)', margin: '0 0 0 10px' }} >
            <Input placeholder="Write Here" />
          </Form.Item>
        </Form.Item>

        <Form.Item rules={[{ required: true }]}>
          <span style={{display: 'inline-block', width: 'calc(50% - 5px)'}}>Summary</span>
          <span style={{display: 'inline-block', width: 'calc(50% - 5px)', margin: '0 0 0 10px'}}>Allow Posting</span>
          <Form.Item name="Summary" rules={[{ required: true, message: '' }]} style={{ display: 'inline-block', width: 'calc(50% - 5px)' }} >
            <Select placeholder="Select Value">
              <Select.Option value="Yes">Yes</Select.Option>
              <Select.Option value="No">No</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="AllowPosting" rules={[{ required: true, message: '' }]} style={{ display: 'inline-block', width: 'calc(50% - 5px)', margin: '0 0 0 10px' }} >
            <Select placeholder="Select Value">
              <Select.Option value="Yes">Yes</Select.Option>
              <Select.Option value="No">No</Select.Option>
            </Select>
          </Form.Item>
        </Form.Item>




        <span>Allow Budgeting</span>
        <Form.Item name="AllowBudgeting" rules={[{ required: true, message: '' }]} >
          <Select placeholder="Select Value">
            <Select.Option value="Yes">Yes</Select.Option>
            <Select.Option value="No">No</Select.Option>
          </Select>
        </Form.Item>
        
        <span>GL Parent Code</span>
        <Form.Item name="GLParentCode" rules={[{ required: true, message: '' }]} >
          <Input placeholder="Write Here" />
        </Form.Item>

        <Form.Item rules={[{ required: true }]}>
          <span style={{display: 'inline-block', width: 'calc(50% - 5px)'}}>Intercompany Account</span>
          <span style={{display: 'inline-block', width: 'calc(50% - 5px)', margin: '0 0 0 10px'}}>Elimination Required</span>
          <Form.Item name="IntercompanyAccount" rules={[{ required: true, message: '' }]} style={{ display: 'inline-block', width: 'calc(50% - 5px)' }} >
            <Select placeholder="Select Value">
              <Select.Option value="Yes">Yes</Select.Option>
              <Select.Option value="No">No</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="EliminationRequired" rules={[{ required: true, message: '' }]} style={{ display: 'inline-block', width: 'calc(50% - 5px)', margin: '0 0 0 10px' }} >
            <Select placeholder="Select Value">
              <Select.Option value="Yes">Yes</Select.Option>
              <Select.Option value="No">No</Select.Option>
            </Select>
          </Form.Item>
        </Form.Item>


        <Form.Item rules={[{ required: true }]}>
          <span style={{display: 'inline-block', width: 'calc(50% - 5px)'}}>Financial Statement</span>
          <span style={{display: 'inline-block', width: 'calc(50% - 5px)', margin: '0 0 0 10px'}}>Mapping under FSLI</span>
          <Form.Item name="FinancialStatement" rules={[{ required: true, message: '' }]} style={{ display: 'inline-block', width: 'calc(50% - 5px)' }} >
            <Select placeholder="Select Value" onChange={handleFinancialStatementChange}>
              <Select.Option value="">Select Value</Select.Option>
              <Select.Option value="Balance Sheet">Balance Sheet</Select.Option>
              <Select.Option value="Profit & Loss and Other comprehensive income">Profit & Loss and Other comprehensive income</Select.Option>
              <Select.Option value="Cash Flow">Cash flow</Select.Option>
              <Select.Option value="NA">NA</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="MappingUnderFSLI" rules={[{ required: true, message: '' }]} style={{ display: 'inline-block', width: 'calc(50% - 5px)', margin: '0 0 0 10px' }} >
            <Select placeholder="Select Value">
              {values?.map(elmnt => <Select.Option value={elmnt.Value}>{elmnt.Value}</Select.Option>)}
            </Select>
          </Form.Item>
        </Form.Item>



      </Form.Item>
    </div>
  );
}

export default GLAccountFields;
