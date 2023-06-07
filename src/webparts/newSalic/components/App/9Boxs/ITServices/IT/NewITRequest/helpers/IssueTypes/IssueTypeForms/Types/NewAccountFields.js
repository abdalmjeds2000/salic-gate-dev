import React, { useContext } from "react";
import { DatePicker, Form, Input, Radio, Select, Space } from "antd";
import { NationaltiesOptions } from "../../../../../../../../Global/NationaltiesOptions/NationaltiesOptions";
import { AppCtx } from "../../../../../../../../App";
import DropdownSelectUser from "../../../../../../../../Global/DropdownSelectUser/DropdownSelectUser";

function NewAccountFields() {
  const { salic_departments } = useContext(AppCtx);

  return (
    <div className="new-account-fields-container">
      <Form.Item name="AccountType" label="Account Type" rules={[{ required: true, message: '' }]}>
        <Radio.Group>
          <Space direction="vertical">
            <Radio value="AccountType1">Email Account</Radio>
            <Radio value="AccountType2">Employee Account (Active Directory)</Radio>
            <Radio value="AccountType3">Contractor</Radio>
            <Radio value="AccountType4">Consultant</Radio>
            <Radio value="AccountType5">Trainee</Radio>
          </Space>
        </Radio.Group>
      </Form.Item>

      <Form.Item label="Account Information" rules={[{ required: true, message: '' }]}>
        <Form.Item rules={[{ required: true }]}>
          <span style={{display: 'inline-block', width: 'calc(50% - 5px)'}}>First Name</span>
          <span style={{display: 'inline-block', width: 'calc(50% - 5px)', margin: '0 0 0 10px'}}>Last Name</span>
          <Form.Item name="FirstName" rules={[{ required: true, message: '' }]} style={{ display: 'inline-block', width: 'calc(50% - 5px)' }} >
            <Input placeholder="Enter First Name" />
          </Form.Item>
          <Form.Item name="LastName" rules={[{ required: true, message: '' }]} style={{ display: 'inline-block', width: 'calc(50% - 5px)', margin: '0 0 0 10px' }} >
            <Input placeholder="Enter Last Name" />
          </Form.Item>
        </Form.Item>

        <span>Company</span>
        <Form.Item name="Company" rules={[{ required: true, message: '' }]} >
          <Input placeholder="Write Here" />
        </Form.Item>
        
        <span>Job Title</span>
        <Form.Item name="JobTitle" rules={[{ required: true, message: '' }]} >
          <Input placeholder="Write Here" />
        </Form.Item>


        <Form.Item rules={[{ required: true }]}>
          <span style={{display: 'inline-block', width: 'calc(50% - 5px)'}}>Nationality</span>
          <span style={{display: 'inline-block', width: 'calc(50% - 5px)', margin: '0 0 0 10px'}}>Department</span>
          <Form.Item name="Nationality" rules={[{ required: true, message: '' }]} style={{ display: 'inline-block', width: 'calc(50% - 5px)' }} >
            <Select placeholder="Select Country">
              {NationaltiesOptions.map(n => <Select.Option value={n.value}>{n.label}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="departments" rules={[{ required: true, message: '' }]} style={{ display: 'inline-block', width: 'calc(50% - 5px)', margin: '0 0 0 10px' }} >
            <Select placeholder="Select Department">
              {salic_departments?.map(dep => <Select.Option value={dep}>{dep}</Select.Option>)}
            </Select>
          </Form.Item>
        </Form.Item>

        <span>Mobile #</span>
        <Form.Item name="Mobile" rules={[{ required: true, message: '' }]} >
          <Input placeholder="Write Here" />
        </Form.Item>

        <span>Phone #</span>
        <Form.Item name="Phone" rules={[{ required: true, message: '' }]} >
          <Input placeholder="Write Here" />
        </Form.Item>


        <Form.Item rules={[{ required: true }]}>
          <span style={{display: 'inline-block', width: 'calc(50% - 5px)'}}>Manager</span>
          <span style={{display: 'inline-block', width: 'calc(50% - 5px)', margin: '0 0 0 10px'}}>Hire Date</span>
          <Form.Item rules={[{ required: true, message: '' }]} style={{ display: 'inline-block', width: 'calc(50% - 5px)' }} >
            <DropdownSelectUser name="Manager" size="middle" placeholder="Select Manager" required={true} isDisabled={false} />
          </Form.Item>
          <Form.Item name="DateOfEmployee" rules={[{ required: true, message: '' }]} style={{ display: 'inline-block', width: 'calc(50% - 5px)', margin: '0 0 0 10px' }} >
            <DatePicker format="MM/DD/YYYY" style={{ width: "100%" }} />
          </Form.Item>
        </Form.Item>

        <Form.Item rules={[{ required: true }]}>
          <span style={{display: 'inline-block', width: 'calc(50% - 5px)'}}>Grade</span>
          <span style={{display: 'inline-block', width: 'calc(50% - 5px)', margin: '0 0 0 10px'}}>National ID\IQAMA</span>
          <Form.Item name="Grade" rules={[{ required: true, message: '' }]} style={{ display: 'inline-block', width: 'calc(50% - 5px)' }} >
            <Select placeholder="Select Grade">
              <Select.Option value="None">None</Select.Option>

              {/* <Select.Option value="A">A</Select.Option>
              <Select.Option value="B">B</Select.Option>
              <Select.Option value="C">C</Select.Option>
              <Select.Option value="D">D</Select.Option>
              <Select.Option value="E">E</Select.Option>
              <Select.Option value="F">F</Select.Option>
              <Select.Option value="G">G</Select.Option> */}

              <Select.Option value={1}>1</Select.Option>
              <Select.Option value={2}>2</Select.Option>
              <Select.Option value={3}>3</Select.Option>
              <Select.Option value={4}>4</Select.Option>
              <Select.Option value={5}>5</Select.Option>
              <Select.Option value={6}>6</Select.Option>
              <Select.Option value={7}>7</Select.Option>
              <Select.Option value={8}>8</Select.Option>
              <Select.Option value={9}>9</Select.Option>
              <Select.Option value={10}>10</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="IQAMA" rules={[{ required: true, message: '' }]} style={{ display: 'inline-block', width: 'calc(50% - 5px)', margin: '0 0 0 10px' }} >
            <Input placeholder="Write Here" />
          </Form.Item>  
        </Form.Item>

        <span>Start & End Date</span>
        <Form.Item name="StartEndDate" rules={[{ required: true, message: false }]}>
          <DatePicker.RangePicker format="MM/DD/YYYY" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item rules={[{ required: true }]}>
          <span style={{display: 'inline-block', width: 'calc(50% - 5px)'}}>With Laptop</span>
          <span style={{display: 'inline-block', width: 'calc(50% - 5px)', margin: '0 0 0 10px'}}>Gender</span>
          <Form.Item name="WithLaptop" rules={[{ required: true, message: '' }]} style={{ display: 'inline-block', width: 'calc(50% - 5px)' }} >
            <Select placeholder="With Laptop ?">
              <Select.Option value="Yes">Yes</Select.Option>
              <Select.Option value="No">No</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="Gender" rules={[{ required: true, message: '' }]} style={{ display: 'inline-block', width: 'calc(50% - 5px)', margin: '0 0 0 10px' }} >
            <Select placeholder="Select Gender">
              <Select.Option value="Male">Male</Select.Option>
              <Select.Option value="Female">Female</Select.Option>
            </Select>
          </Form.Item>
        </Form.Item>

        <span>Private Email Address</span>
        <Form.Item name="PrivateEmail" rules={[{ required: true, message: false }]}>
          <Input placeholder="e.g. example@mail.com" />
        </Form.Item>
      </Form.Item>
    </div>
  );
}

export default NewAccountFields;
