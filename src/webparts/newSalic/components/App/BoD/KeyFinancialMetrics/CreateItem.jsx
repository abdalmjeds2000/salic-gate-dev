import React, { useEffect, useState } from 'react';
import { Button, Col, Drawer, Form, InputNumber, Row, Select, message } from 'antd';
import NewSelectItem from '../../CorporateObjectiveKPIs/components/NewSelectItem';
import { roundedNum } from '../../Global/roundedNum';
import pnp from 'sp-pnp-js';



const CreateItem = ({ dataSource, onSuccess }) => {
  const [openDrawer, setOpenDrawer] = useState(false)
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const [selectedRatios, setSelectedRatios] = useState("");
  const [selectedMeasures, setSelectedMeasures] = useState("");

  const [ratios, setRatios] = useState([]);
  const [meatures, setMeasures] = useState([]);

  let TypesList = dataSource?.map((r) => r.parent).filter(function (item, pos, self) { return self.indexOf(item) == pos; }).map(item => item);
  let SubClassificationsList = dataSource?.filter((item) => { return item.groupBy === "Measures"; })?.map(item => item.header)?.filter(function (item, pos, self) { return self.indexOf(item) == pos; });
  useEffect(() => {
    let types__ = TypesList;
    let subClassifications__ = SubClassificationsList;
    setRatios(types__);
    setMeasures(subClassifications__);
  }, [dataSource, selectedRatios, selectedMeasures]);


  const createItem = async (form_data) => {
    setLoading(true);
      form_data.KeyFinancialRatio?.trim();
      form_data.Measures?.trim();
      const response = await pnp.sp.web.lists.getByTitle('KeyFinancialMetrics').items.add(form_data);
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
          <Form.Item label="Key Financial Ratio" name="KeyFinancialRatio" size="large" rules={[{required: true, message: ''}]}>
            <Select
              size='large'
              allowClear 
              onChange={value => setSelectedRatios(value)} 
              placeholder="Select Type"
              dropdownRender={(menu) => <NewSelectItem menu={menu} setItems={setRatios} />}
            >
              {ratios?.map((item, i) => <Select.Option key={i} value={item}>{item}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item label="Measures" name="Measures" size="large" rules={[{required: true, message: ''}]}>
            <Select
              size='large'
              allowClear
              onChange={value => setSelectedMeasures(value)}
              placeholder="Select Sub Classification"
              dropdownRender={(menu) => <NewSelectItem menu={menu} setItems={setMeasures} />}
            >
              {meatures?.map((item, i) => <Select.Option key={i} value={item}>{item}</Select.Option>)}
            </Select>
          </Form.Item>
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