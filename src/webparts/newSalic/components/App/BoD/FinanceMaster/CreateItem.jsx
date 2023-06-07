import React, { useEffect, useState } from 'react';
import { Button, Col, Drawer, Form, InputNumber, Row, Select, message } from 'antd';
import NewSelectItem from '../../CorporateObjectiveKPIs/components/NewSelectItem';
import { roundedNum } from '../../Global/roundedNum';
import pnp from 'sp-pnp-js';



const CreateItem = ({ data, dataSource, onSuccess }) => {
  const [openDrawer, setOpenDrawer] = useState(false)
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const [selectedTypes, setSelectedTypes] = useState("");
  const [selectedSubClassifications, setSelectedSubClassifications] = useState("");

  const [types, setTypes] = useState([]);
  const [subClassifications, setSubClassifications] = useState([]);
  const [descriptions, setDescriptions] = useState([]);

  let TypesList = dataSource?.map((r) => r.parent).filter(function (item, pos, self) { return self.indexOf(item) == pos; }).map(item => item);
  let SubClassificationsList = dataSource?.filter((item) => { return item.groupBy === "SubClassification"; })?.map(item => item.header)?.filter(function (item, pos, self) { return self.indexOf(item) == pos; });
  let DescriptionsList = dataSource?.filter((item) => { return item.groupBy === "Description"; })?.filter(function (item, pos, self) { return self.indexOf(item) == pos; })?.filter(item => item);
  useEffect(() => {
    let types__ = TypesList;
    let subClassifications__ = SubClassificationsList;
    let descriptions__ = DescriptionsList?.filter(row => row.parent?.toLowerCase().includes(selectedTypes?.toLowerCase() || ''))?.map(item => item.header);
    setTypes(types__);
    setSubClassifications(subClassifications__);
    setDescriptions(descriptions__);
  }, [dataSource, selectedTypes, selectedSubClassifications]);


  const createItem = async (form_data) => {
    setLoading(true);
      form_data.FType = form_data.FType?.trim();
      form_data.SubClassification = form_data.SubClassification?.trim();
      form_data.Description = form_data.Description?.trim();

      form_data.Change = roundedNum(form_data.Change / 100);
      form_data.Variance = roundedNum(form_data.Variance / 100);
      form_data.DescriptionIndex = data.find(row => row.Description?.toLowerCase() === form_data.Description?.toLowerCase())?.DescriptionIndex || 1;
      const response = await pnp.sp.web.lists.getByTitle('FinanceMaster').items.add(form_data);
      message.success('Item has been created successfully')
      onSuccess(response.data);
      form.resetFields();
      setOpenDrawer(false);

    setLoading(false);
  }


  return (
    <>
      <Button type='primary' size='small' onClick={() => setOpenDrawer(true)}>
        Create Item
      </Button>

      <Drawer title="New Item" placement="right" onClose={() => setOpenDrawer(false)} open={openDrawer}>
        <Form name="create-new-item" form={form} onFinish={createItem} layout="vertical" onFinishFailed={() => message.error("Please, Fill All Required Fields!")}>
          <Form.Item label="Type" name="FType" size="large" rules={[{required: true, message: ''}]}>
            <Select
              size='large'
              allowClear 
              onChange={value => setSelectedTypes(value)} 
              placeholder="Select Type"
              dropdownRender={(menu) => <NewSelectItem menu={menu} setItems={setTypes} />}
            >
              {types?.map((item, i) => <Select.Option key={i} value={item}>{item}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item label="Sub Classification" name="SubClassification" size="large" rules={[{required: true, message: ''}]}>
            <Select
              size='large'
              allowClear
              onChange={value => setSelectedSubClassifications(value)}
              placeholder="Select Sub Classification"
              dropdownRender={(menu) => <NewSelectItem menu={menu} setItems={setSubClassifications} />}
            >
              {subClassifications?.map((item, i) => <Select.Option key={i} value={item}>{item}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item label="Description" name="Description" size="large" rules={[{required: true, message: ''}]}>
            <Select
              size='large'
              allowClear
              placeholder="Select Description"
              dropdownRender={(menu) => <NewSelectItem menu={menu} setItems={setDescriptions} />}
            >
              {descriptions?.map((item, i) => <Select.Option key={i} value={item}>{item}</Select.Option>)}
            </Select>
          </Form.Item>
          {/* <Form.Item label="Description Index" name="DescriptionIndex" size="large" rules={[{required: true, message: ''}]}>
            <InputNumber parser={(value) => Math.round(value)} step={1} size='large' placeholder='generated' />
          </Form.Item> */}
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Year" initialValue={new Date().getFullYear()} name="Year" size="large" rules={[{required: true, message: ''}]}>
                <InputNumber parser={(value) => Math.round(value)} step={1} min={1900} max={2100} size='large' placeholder='Pick a Year' style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Month" initialValue={new Date().getMonth()+1} name="Month" size="large" rules={[{required: true, message: ''}]}>
                <InputNumber parser={(value) => Math.round(value)} step={1} min={1} max={12} size='large' placeholder='Pick a Month' style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Actual" initialValue={0} name="Actual" size="large" rules={[{required: true, message: ''}]}>
                <InputNumber parser={(value) => roundedNum(value)} step={0.01} max={10000000} placeholder='Actual' style={{ width: '100%' }} size='large' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Budget" initialValue={0} name="Budget" size="large" rules={[{required: true, message: ''}]}>
                <InputNumber parser={(value) => roundedNum(value)} step={0.01} max={10000000} placeholder='Budget' style={{ width: '100%' }} size='large' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Forcast" initialValue={0} name="Forcast" size="large" rules={[{required: true, message: ''}]}>
                <InputNumber parser={(value) => roundedNum(value)} step={0.01} max={10000000} placeholder='Forcast' style={{ width: '100%' }} size='large' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="%Change" initialValue={0} name="Change" size="large" rules={[{required: true, message: ''}]}>
                <InputNumber formatter={(value) => `${roundedNum(value)}%`} parser={(value) => roundedNum(Number(value.replace('%', '')))} step={0.1} max={10000000} placeholder='Change' style={{ width: '100%' }} size='large' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="%Variance" initialValue={0} name="Variance" size="large" rules={[{required: true, message: ''}]}>
                <InputNumber formatter={(value) => `${roundedNum(value)}%`} parser={(value) => roundedNum(Number(value.replace('%', '')))} step={0.1} max={10000000} placeholder='Variance' style={{ width: '100%' }} size='large' />
              </Form.Item>
            </Col>
          </Row>


          <Row justify="end" gutter={10} style={{ marginTop: 25 }}>
            <Col><Button size='large' type='primary' htmlType='submit' loading={loading}>Add Item</Button></Col>
            <Col><Button size='large' onClick={() => setOpenDrawer(false)}>Cancel</Button></Col>
          </Row>
        </Form>
      </Drawer>
    </>
  )
}

export default CreateItem