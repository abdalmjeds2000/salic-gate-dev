import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Drawer, Form, Input, InputNumber, message, Radio, Row, Select, Tooltip } from 'antd';
import AddNewKPI from '../API/AddKpi';
import { PlusOutlined } from '@ant-design/icons';
import NewSelectItem from '../components/NewSelectItem';
import { AppCtx } from '../../App';

function CreateKPIItem({ year, onSuccess, data }) {
  const  { salic_departments } = useContext(AppCtx);
  const [openModal, setOpenModal] = useState(false)
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [prospectives, setProspectives] = useState([]);
  const [objectives, setObjectives] = useState([]);
  const [owners, setOwners] = useState([]);

  const [selectedProspectives, setSelectedProspectives] = useState("");
  const [selectedObjectives, setSelectedObjectives] = useState("");


  const createItem = async (form_data) => {
    setLoading(true);
    if(form_data.field_5 === "%") {
      form_data.field_22 = Number(form_data.field_22) / 100;
      form_data.field_14 = Number(form_data.field_14) / 100;
    }
    form_data.Year = `${year}`;

    const response = await AddNewKPI(form_data);
    if(response) {
      onSuccess(response);
      console.log(response);
      form.resetFields();
      setOpenModal(false);
    }
    setLoading(false);
  }


  let PerspectivesList = data?.map((r) => r.parent).filter(function (item, pos, self) { return self.indexOf(item) == pos; }).map(item => item);
  let ObjectiveList = data?.filter((item) => { return item.groupBy === "Objective"; });
  // let OwnersList = data?.map((r) => r.field_16)?.filter(function (item, pos, self) { return self.indexOf(item) == pos; })?.filter(item => item);

  useEffect(() => {
    let perspectives__ = PerspectivesList;
    // let ownersList__ = OwnersList;
    let objective__ = ObjectiveList?.filter(row => row.parent?.toLowerCase().includes(selectedProspectives?.toLowerCase()))?.map(item => item.header);

    setProspectives(perspectives__);
    setObjectives(objective__);
    // setOwners(ownersList__);
  }, [data, selectedProspectives, selectedObjectives]);




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
              {prospectives?.map((item, i) => <Select.Option key={i} value={item}>{item}</Select.Option>)}
            </Select>
          </Form.Item>
          {/* <Form.Item label="Enabler" name="field_2" size="large" rules={[{required: true, message: ''}]}>
            <Select 
              allowClear 
              onChange={value => setSelectedEnablers(value)} 
              placeholder="Select Enabler Name"
              dropdownRender={(menu) => <NewSelectItem menu={menu} setItems={setEnablers} />}
            >
              {enablers?.map((item, i) => <Select.Option key={i} value={item?.header}>{item?.header}</Select.Option>)}
            </Select>
          </Form.Item> */}
          <Form.Item label="Objective" name="field_3" size="large" rules={[{required: true, message: ''}]}>
            <Select 
              allowClear 
              onChange={value => setSelectedObjectives(value)} 
              placeholder="Select Objective Name"
              dropdownRender={(menu) => <NewSelectItem menu={menu} setItems={setObjectives} />}
            >
              {objectives?.map((item, i) => <Select.Option key={i} value={item}>{item}</Select.Option>)}
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
          <Form.Item label="Owner" name="field_16" size="large">
            <Select
              allowClear 
              placeholder="Choose Owner"
              dropdownRender={(menu) => <NewSelectItem menu={menu} setItems={setOwners} />}
            >
              {[...owners, ...salic_departments]?.map((item, i) => <Select.Option key={i} value={item}>{item}</Select.Option>)}
            </Select>
          </Form.Item>
          {/* <Row justify="end" gutter={10}>
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
          </Row> */}
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