import React, { useEffect, useState } from 'react';
import { Button, Col, Drawer, Form, Input, InputNumber, message, Radio, Row, Select, Tooltip } from 'antd';
import AddNewKPI from '../API/AddKpi';
import { PlusOutlined } from '@ant-design/icons';
import NewSelectItem from '../components/NewSelectItem';

function CreateKPIItem({ listName, onSuccess, data }) {
  const [openModal, setOpenModal] = useState(false)
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [prospectives, setProspectives] = useState([]);
  const [enablers, setEnablers] = useState([]);
  const [objectives, setObjectives] = useState([]);

  const [selectedProspectives, setSelectedProspectives] = useState("");
  const [selectedEnablers, setSelectedEnablers] = useState("");
  const [selectedObjectives, setSelectedObjectives] = useState("");


  const createItem = async (form_data) => {
    setLoading(true);
    if(form_data.field_5 === "%") {
      form_data.Q1Target = Number(form_data.Q1Target) / 100;
      form_data.Q2Target = Number(form_data.Q2Target) / 100;
      form_data.Q3Target = Number(form_data.Q3Target) / 100;
      form_data.Q4Target = Number(form_data.Q4Target) / 100;
      form_data.field_22 = Number(form_data.field_22) / 100;
      form_data.field_14 = Number(form_data.field_14) / 100;
    }

    const response = await AddNewKPI(form_data, listName);
    if(response) {
      onSuccess(response);
      console.log(response);
      form.resetFields();
      setOpenModal(false);
    }
    setLoading(false);
  }


  let PerspectivesList = data?.map((r) => r.parent).filter(function (item, pos, self) { return self.indexOf(item) == pos; }).map(item => ({ header: item }));
  let EnablersList = data?.filter((item) => { return item.groupBy === "Enabler"; });
  let ObjectiveList = data?.filter((item) => { return item.groupBy === "Objective"; });

  useEffect(() => {
    let perspectives__ = PerspectivesList;
    let enablers__ = EnablersList.filter(row => row.parent?.toLowerCase().includes(selectedProspectives?.toLowerCase()));
    let objective__ = ObjectiveList.filter(row => row.parent?.toLowerCase().includes(selectedProspectives?.toLowerCase()) && row.enabler?.toLowerCase().includes(selectedEnablers?.toLowerCase()));

    setProspectives(perspectives__);
    setEnablers(enablers__);
    setObjectives(objective__);
  }, [data, selectedProspectives, selectedEnablers, selectedObjectives]);



  return (
    <>
      <Button type='primary' size='small' onClick={() => setOpenModal(true)}>
        <PlusOutlined /> Create Item
      </Button>
      <Drawer title="New KPI Item" placement="right" onClose={() => setOpenModal(false)} open={openModal}>
        <Form name="create-new-item" form={form} onFinish={createItem} layout="vertical" onFinishFailed={() => message.error("Please, Fill Form Correctly!")}>
          <Form.Item label="Prospective" name="field_1" size="large" rules={[{required: true, message: ''}]}>
            <Select 
              allowClear 
              onChange={value => setSelectedProspectives(value)} 
              placeholder="Select Prospective Type"
              dropdownRender={(menu) => <NewSelectItem menu={menu} setItems={setProspectives} />}
            >
              {prospectives?.map((item, i) => <Select.Option key={i} value={item?.header}>{item?.header}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item label="Enabler" name="field_2" size="large" rules={[{required: true, message: ''}]}>
            <Select 
              allowClear 
              onChange={value => setSelectedEnablers(value)} 
              placeholder="Select Enabler Name"
              dropdownRender={(menu) => <NewSelectItem menu={menu} setItems={setEnablers} />}
            >
              {enablers?.map((item, i) => <Select.Option key={i} value={item?.header}>{item?.header}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item label="Objective" name="field_3" size="large" rules={[{required: true, message: ''}]}>
            <Select 
              allowClear 
              onChange={value => setSelectedObjectives(value)} 
              placeholder="Select Objective Name"
              dropdownRender={(menu) => <NewSelectItem menu={menu} setItems={setObjectives} />}
            >
              {objectives?.map((item, i) => <Select.Option key={i} value={item?.header}>{item?.header}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item label="KPI Title" name="field_4" size="large" initialValue="" rules={[{required: true, message: ''}]}>
            <Input placeholder="Enter KPI Title" addonBefore={
                <Form.Item name="field_5" initialValue="#" rules={[{required: true, message: ''}]} noStyle>
                  <Select style={{ width: 80 }} >
                    <Select.Option value="#">#</Select.Option>
                    <Select.Option value="%">%</Select.Option>
                    <Select.Option value="$">$</Select.Option>
                  </Select>
                </Form.Item>
              }
            />
          </Form.Item>
          <Form.Item label="Trend" name="field_19" size="large" initialValue="Ascend">
            <Radio.Group style={{ width: "100%" }}>
              <Radio.Button value="Ascend">Ascend</Radio.Button>
              <Radio.Button value="Descend">Descend</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Weight %" name="field_6" size="large" initialValue={0}>
            <InputNumber placeholder="Enter Weight %" step={0.1} min={0} max={100} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Owner" name="field_16" size="large" initialValue="Investment">
            <Select>
              <Select.Option value="Investment">Investment</Select.Option>
              <Select.Option value="Commercial">Commercial</Select.Option>
              <Select.Option value="Finance">Finance</Select.Option>
              <Select.Option value="Corporate Communication">Corporate Communication</Select.Option>
              <Select.Option value="Shared Services">Shared Services</Select.Option>
              <Select.Option value="Strategy & Risk">Strategy & Risk</Select.Option>
              <Select.Option value="Legal & Corporate G&C">Legal & Corporate G&C</Select.Option>
            </Select>
          </Form.Item>
          <Row justify="end" gutter={10}>
            <Col xs={24} md={12} lg={12}>
              <Form.Item label="Target Q1" name="Q1Target" size="large" initialValue={0}>
              <InputNumber placeholder="Enter Target Q1" step={0.1} min={0} max={100} style={{ width: "100%" }} />
              </Form.Item></Col>
            <Col xs={24} md={12} lg={12}>
              <Form.Item label="Target Q2" name="Q2Target" size="large" initialValue={0}>
              <InputNumber placeholder="Enter Target Q2" step={0.1} min={0} max={100} style={{ width: "100%" }} />
              </Form.Item></Col>
            <Col xs={24} md={12} lg={12}>
              <Form.Item label="Target Q3" name="Q3Target" size="large" initialValue={0}>
              <InputNumber placeholder="Enter Target Q3" step={0.1} min={0} max={100} style={{ width: "100%" }} />
              </Form.Item></Col>
            <Col xs={24} md={12} lg={12}>
              <Form.Item label="Target Q4" name="Q4Target" size="large" initialValue={0}>
              <InputNumber placeholder="Enter Target Q4" step={0.1} min={0} max={100} style={{ width: "100%" }} />
              </Form.Item></Col>
          </Row>
          <Form.Item label="Annual Target" name="field_14" size="large" initialValue={0}>
            <InputNumber placeholder="Enter Annual Target" step={0.1} min={0} max={100} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Actual Full Year" name="field_22" size="large" initialValue={0}>
            <InputNumber placeholder="Enter Actual Full Year" step={0.1} min={0} max={100} style={{ width: "100%" }} />
          </Form.Item>
          <Row justify="end" gutter={10}>
            <Col><Button type='primary' htmlType='submit' loading={loading}>Add Item</Button></Col>
            <Col><Button onClick={() => setOpenModal(false)}>Cancel</Button></Col>
          </Row>
        </Form>
      </Drawer>
    </>
  )
}

export default CreateKPIItem