import React, { useContext, useEffect, useState } from 'react';
import { Button, Form, message, Radio, Select, Space } from 'antd';
import Section from '../../../../../Global/RequestsComponents/Section';
import GetIssuesTypes from '../../../API/GetIssuesTypes';
import UpdateITRequest from '../../../API/UpdateITRequest';
import { AppCtx } from '../../../../../App';
import pnp from 'sp-pnp-js';


function UpdateRequestForm(props) {
  const { user_data } = useContext(AppCtx);
  const [form] = Form.useForm();
  const [issueTypes, setIssueTypes] = useState([]);
  const [categoryTypeField, setCategoryTypeField] = useState(props.RequestData?.Category);
  const [issueTypeField, setIssueTypeField] = useState(props.RequestData?.IssueType);
  // Get Issue Types from shrepoint
  const GetIssuesFromSP = async () => {
    const response = await GetIssuesTypes();
    return response;
  }
  // When open page Get Issue Types from shrepoint (Once)
  useEffect(() => {
    GetIssuesFromSP().then(res => setIssueTypes(res))
  }, []);


  const UpdateItServiceRequest = async (values) => {
    if(
      props.RequestData?.Category === values.CategoryType &&
      props.RequestData?.IssueType === values.IssueType &&
      props.RequestData?.Priority === values.Priority 
    ) {
      console.log("NO CHANGE ON UPDATE FORM");
    } else {
      values.Id = props.RequestData?.Id;
      const updateRequest = await UpdateITRequest(values);
      message.success("IT Request has been Updated Successfully!");
      props.handleAfterUpdate();
    }
  }

  var requester = props.RequestData?.Requester;
  var onbehalf = props.RequestData?.OnBehalfOf;
  if (onbehalf != null){ requester = onbehalf; }

  // const IsUpdatable = props.RequestData?.EmployeeList?.findIndex(e => e.Mail?.toLowerCase() === user_data?.Data?.Mail?.toLowerCase());
  const [ITAdmins, setITAdmins] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchITAdmins = async () => {
    const groupName = 'IT_Admin';
    const users = await pnp.sp.web.siteGroups.getByName(groupName).users.get();
    users.map(user => {
      if(user?.Email?.toLowerCase() === user_data?.Data?.Mail?.toLowerCase()) {
        setIsAdmin(true);
      }
    });
    setITAdmins(users);
  }
  useEffect(() => {
    if(Object.keys(user_data).length > 0) {
      fetchITAdmins();
    }
  }, [user_data])
  

  const IsClosed = props.RequestData?.Status === "CLOSED";
  if(ITAdmins.length === 0) {
    return <></>
  }

  return (
    <Form
      form={form}
      name="update-it-request"
      onFinish={UpdateItServiceRequest}
      onFinishFailed={() => message.error("Please, fill out the form correctly.") }
    >
      <div>
        <Section SectionTitle={<span style={{marginTop: -20}}>Issue Category</span>}>
          <Form.Item name="CategoryType" initialValue={props.RequestData?.Category} style={{marginBottom: 5}}>
            <Radio.Group disabled={!isAdmin || IsClosed} size='middle' value={categoryTypeField} onChange={({ target: { value } }) => {setCategoryTypeField(value); setIssueTypeField("")}} rules={[{ required: true }]} >
              <Space direction="vertical">
                <Radio value="Hardware">
                  <span>Hardware & Devices</span> <br />
                </Radio>
                <Radio value="Software">
                  <span>Software & Applications</span> <br />
                </Radio>
                <Radio value="Access">
                  <span>Access, Permissions, and Licenses</span> <br />
                </Radio>
                <Radio value="Security">
                  <span>Security Incident</span> <br />
                </Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
        </Section>
        <Section SectionTitle="Issue Type">
          <Form.Item name="IssueType" initialValue={props.RequestData?.IssueType}  style={{marginBottom: 5}}>
            <Select
              placeholder="Select Issue Type"
              size="middle"
              value={issueTypeField}
              onChange={(value) => setIssueTypeField(value)}
              disabled={!isAdmin || IsClosed}
            >
              {issueTypes
                .filter((i) => i.Category === categoryTypeField)
                .map((option) => (
                  <Select.Option value={option.IssueType}>{option.IssueType}</Select.Option>
                ))}
              <Select.Option value="Other">Other</Select.Option>
            </Select>
          </Form.Item>
        </Section>
        <Section SectionTitle="Priority">
          <Form.Item name="Priority" initialValue={props.RequestData?.Priority} style={{marginBottom: 5}}>
            <Select placeholder="Priority" size="middle" disabled={!isAdmin || IsClosed}>
              <Select.Option value="1">Normal</Select.Option>
              <Select.Option value="2">Critical</Select.Option>
            </Select>
          </Form.Item>
        </Section>

        {(isAdmin && !IsClosed) && <Button type="primary" htmlType='submit' style={{width: '100%', marginTop: 10}}>
          Update Request Information
        </Button>}
      </div>
    </Form>
  )
}

export default UpdateRequestForm