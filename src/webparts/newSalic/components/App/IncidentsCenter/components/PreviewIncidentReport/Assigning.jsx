import { Button, Col, Descriptions, Form, Input, Row, Select, Typography, message, notification } from 'antd';
import React, { useContext, useState } from 'react';
import DropdownSelectUser from '../../../Global/DropdownSelectUser/DropdownSelectUser';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { AppCtx } from '../../../App';
import axios from 'axios';
import { TbSend } from 'react-icons/tb';

function hasDepartmentDuplicates(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i]?.ResponsibleDepartment === arr[j]?.ResponsibleDepartment) {
        return true;
      }
    }
  }
  return false;
}
const contentStyle = {
  fontSize: "1rem",
};



const Assigning = ({ reportData, onFinish }) => {
  const { user_data, defualt_route, salic_departments } = useContext(AppCtx);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const submitData = async (values) => {
    setLoading(true);
    let data = values;
    data.Email = user_data?.Data?.Mail;
    data.Id = `${reportData.Id}`;
    if(data?.Assignees?.length) {
      if(hasDepartmentDuplicates(data?.Assignees)) {
        setLoading(false);
        notification.error({message: "Failed:", description: "You can't assign the same department twice."})
        return;
      }
    }
    data.Assignees = data?.Assignees?.map(item => ({...item, AssignedBy: user_data?.Data?.Mail}));

    const response = await axios.post('https://dev.salic.com/api/Incidents/Assign', data);
    if(response?.status == 200 || response?.status == 201) {
      if(onFinish) onFinish();
      notification.success({message: response?.data?.Message || "DONE !"});
    } else {
      notification.error({message: "failed"});
    }
    setLoading(false);
  }


  return (
    <div style={{ maxWidth: 1500, margin: '0 auto' }}>
      {["REVIEW"].includes(reportData?.Status) ? (
        <Form
          name="risk-department-part" 
          layout="vertical"
          form={form} 
          onFinish={submitData}
          onFinishFailed={() => message.error("Please, fill out the form correctly.")}
        >
          <Form.Item>
            <Form.List
              name="Assignees"
              rules={[{
                validator: async (_, items) => {
                  if (!items || items.length < 1) {
                    return Promise.reject();
                  }},
              }]}
            >
              {(fields, { add, remove }, { errors }) => (
                <>
                  {fields?.map((field, index) => (
                    <Row gutter={[15, 0]} style={{ padding: 10, borderRadius: 5, border: '1px solid #eee', marginBottom: 10 }}>
                      <Col span={24}>
                        <Form.Item name={[field.name, "RiskDepartmentComment"]} label="Risk Department Comments" rules={[{required: true, message: ""}]}>
                          <Input.TextArea size='large' rows={4} placeholder="comments from reviewers" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} lg={12}>
                        <Form.Item name={[field.name, "ResponsibleDepartment"]} label="Responsible Department" rules={[{required: true, message: ""}]}>
                          <Select
                            showSearch
                            removeIcon
                            size='large'
                            placeholder="Select a department"
                            optionFilterProp="children"
                            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase()) }
                            options={[
                              { value: 'IT', label: 'Department Of IT', },
                              ...salic_departments.filter(item => item !== "").map(item => ({ label: item, value: item }))
                            ]}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} lg={12}>
                        <Form.Item label={<><Typography.Text type='danger'>*</Typography.Text> Assign Respondent</>}>
                          <DropdownSelectUser name={[field.name, "AssignTo"]} placeholder="select person name" required={true} />
                        </Form.Item>
                      </Col>
                      <Col span={24} style={{display: 'flex', justifyContent: 'flex-end'}}>
                        {fields.length > 1 ? (
                          <Button danger icon={<MinusCircleOutlined />} onClick={() => remove(field.name)}>Remove</Button>
                        ) : null}
                      </Col>
                    </Row>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    onLoad={add}
                    style={{width: '100%', marginTop: 25}}
                    size='large'
                    icon={<PlusOutlined />}
                  >
                    Add Department
                  </Button>
                  <Form.ErrorList errors={errors} />
                </>
              )}
            </Form.List>
          </Form.Item>
          <Row justify="end" gutter={10}>
            <Col>
              <Button htmlType='submit' type='primary' loading={loading}>Assign</Button>
            </Col>
            <Col>
              <Button type='primary' danger onClick={() => navigate(defualt_route + "/incidents-center")}>Cancel</Button>
            </Col>
          </Row>
        </Form>
      ) : (
        <React.Fragment>
          {reportData?.Assignees?.map(item => (
            <Descriptions size='small' contentStyle={contentStyle} layout="vertical" bordered column={1} style={{ marginBottom: 15 }}>
              <Descriptions.Item label={<><TbSend /> Refer to <span style={{fontWeight: 500}}>{item?.ToUser?.DisplayName} ({item?.ResponsibleDepartment})</span>, by <span style={{fontWeight: 500}}>{item?.ByUser?.DisplayName}</span>.</>}>
                {item?.RiskDepartmentComment || ' - '}
              </Descriptions.Item>
            </Descriptions>
          ))}
        </React.Fragment>
      )}
    </div>
  )
}

export default Assigning