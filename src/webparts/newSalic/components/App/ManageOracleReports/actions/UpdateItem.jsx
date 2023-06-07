import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, message, Row, Select, Transfer } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import axios from 'axios';


const UpdateItem = ({ item, folders, onFinish }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  // const [gateUsers, setGateUsers] = useState([]);
  // const [targetKeys, setTargetKeys] = useState([]);

  const handleUpdate = async (form_values) => {
    setLoading(true);
    if(form_values.ParentId === "-1") {
      delete form_values.ParentId;
    }

    const Permissions_ = {
      LinkId: item.id,
      Users: targetKeys || [],
    }
    const payload = {
      Id: item.id,
      Permissions: Permissions_,
      ...form_values
    }
    const response = await axios.post("https://dev.salic.com/api/reports/Update", payload);
    if(response.data.Status === 200) {
      onFinish();
      message.success("Item information have been updated successfully");
      console.log(payload);
    }

    setLoading(false);
  }

  const [mockData, setMockData] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);
  const getComm = async () => {
    const tempTargetKeys = [];
    const response = await axios.get('https://dev.salic.com/api/User/GetCommunicationList');
    const newData = response?.data?.Data?.map(item => ({
      key: item.email,
      title: item.name,
      chosen: false,
    }));
    setMockData(newData);
    setTargetKeys(tempTargetKeys);
  };
  const getPermission = async () => {
    const permissionsList = await axios.get(`https://dev.salic.com/api/reports/GetPermissionsByLinkId?LinkId=${item.id}`);
    const _d = permissionsList?.data?.Data?.map(m => m?.Email);
    setTargetKeys(_d);
  };
  useEffect(() => {
    getComm()
  }, []);
  useEffect(() => {
    if(item && Object.keys(item)?.length !== 0) {
      getPermission();
    }
  }, [item]);


  console.log('targetKeys', targetKeys);

  useEffect(() => {
    form.setFieldsValue({Label: item.Text, ParentId: !item.ParentId ? "-1" : item.ParentId, Link: item.Link, })
  }, [item]);

  if(!item || Object.keys(item)?.length === 0 || loading) {
    return <></>
  }
  return (
    <div>
      <Form 
        name="update-oracle-report-item" 
        form={form} 
        layout="vertical" 
        onFinish={handleUpdate} onFinishFailed={() => message.error("Fill Form Correctly!")}
      >
        <Row gutter={[12, 12]}>
          <Col xs={24} lg={12}>
            <Form.Item
              label="Name"
              name="Label"
              rules={[{required: true, message: ''}]}
              initialValue={item.Text}
            >
              <Input size='large' maxLength={200} placeholder='update name' />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              label="Parent"
              name="ParentId"
              rules={[{required: true, message: ''}]}
              initialValue={item.ParentId ? item.ParentId : "-1"}
            >
              <Select 
                size='large'
                placeholder="select new parent"
                options={[
                  { value: "-1", label: " " },
                  ...folders.map(folder => ({ value: folder.id, label: folder.Text })),
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            {!item.IsFolder && <Form.Item
              label="Report URL"
              name="Link"
              rules={[{required: true, message: ''}]}
              initialValue={item.Link}
            >
              <TextArea size='large' rows={4} maxLength={5000} />
            </Form.Item>}
          </Col>

          <Col span={24}>
            <Transfer
              dataSource={mockData}
              showSearch
              filterOption={(inputValue, option) => option?.title?.toLowerCase()?.indexOf(inputValue) > -1}
              targetKeys={targetKeys}
              onChange={(newTargetKeys) => setTargetKeys(newTargetKeys)}
              render={(item) => item.title}
            />
          </Col>
          <Col span={24}>
            <Row justify="end">
              <Col>
                <Button type='primary' size='large' htmlType='submit' loading={loading} style={{ margin: "25px 0", borderRadius: 5 }}>
                  Update
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>

    </div>
  )
}

export default UpdateItem