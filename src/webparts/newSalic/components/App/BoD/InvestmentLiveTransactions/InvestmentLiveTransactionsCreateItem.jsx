import React from 'react';
import { Button, Drawer, Form, Input, InputNumber, Select, message } from 'antd';
import pnp from 'sp-pnp-js';
import TextArea from 'antd/lib/input/TextArea';
import AddSelectItem from '../../9Boxs/ITServices/Assets/components/AddSelectItem';
import { PlusOutlined } from '@ant-design/icons';


const InvestmentLiveTransactionsCreateItem = ({ onFinish }) => {
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const [typesList, setTypesList] = React.useState(['Local', 'International']);
  const [considerationList, setConsiderationList] = React.useState(['Primary', 'Secondary', 'Primary & Secondary']);

  const handleSubmit = async (form_values) => {
    setLoading(true);
    try {
      const item_resp = await pnp.sp.web.lists.getByTitle('BoD Investment Live Transactions').items.add(form_values);
      if(onFinish) onFinish(item_resp?.data);
      setLoading(false);
      form.resetFields();
      message.success('Item added successfully!');
      setOpenDrawer(false);
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <>
      <Button type='primary' size='small' onClick={() => setOpenDrawer(true)} icon={<PlusOutlined />} loading={loading}>Create Item</Button>
      <Drawer title="Add New Items" width={500} placement="right" onClose={() => setOpenDrawer(false)} open={openDrawer}>
        <Form form={form} layout='vertical' disabled={loading} onFinish={handleSubmit} onFinishFailed={() => message.error('Please, fill all required fields!')}>
          <Form.Item name="Type_" label="Type">
            <Select
              placeholder="Select a type" size="large"
              options={typesList?.map((item) => ({label: item, value: item }))}
              dropdownRender={menu => <AddSelectItem menu={menu} setItems={setTypesList} />}
            />
          </Form.Item>
          <Form.Item name="ProjectName" label="Project Name">
            <Input size="large" placeholder='write here' />
          </Form.Item>
          <Form.Item name="Target" label="Target">
            <Input size="large" placeholder='write here' />
          </Form.Item>
          <Form.Item name="Stake" label="Stake">
            <Input size="large" placeholder='write here' />
          </Form.Item>
          <Form.Item name="Commodity" label="Commodity">
            <TextArea rows={4} size='large' placeholder='write here' />
          </Form.Item>
          <Form.Item name="Country" label="Country">
            <TextArea rows={4} size='large' placeholder='write here' />
          </Form.Item>
          <Form.Item name="SALICCoverage" label="SALIC Coverage (Tons)" initialValue={0}>
            <InputNumber size="large" step={1} placeholder='Enter a number' style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="Contribution" label="Contribution" initialValue={0}>
            <InputNumber size="large" step={1} placeholder='Enter a number' style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="Consideration" label="Consideration">
            <Select
              placeholder="Select consideration" size="large"
              options={considerationList?.map((item) => ({label: item, value: item }))}
              dropdownRender={menu => <AddSelectItem menu={menu} setItems={setConsiderationList} />}
            />
          </Form.Item>
          <Form.Item name="Status" label="Status">
            <Input size="large" placeholder='write here' />
          </Form.Item>
          <Form.Item name="Comments" label="Comments">
            <TextArea rows={4} size='large' placeholder='write here' />
          </Form.Item>
          <Form.Item name="NextSteps" label="Next Steps">
            <TextArea rows={4} size='large' placeholder='write here' />
          </Form.Item>
          <Form.Item name="CommodityCoverage" label="Commodity Coverage">
            <Input size="large" placeholder='write here' />
          </Form.Item>
          <Form.Item name="DealSize_x0028_US_x0024_mm_x0029" label="Deal Size (US$ mm)">
            <InputNumber size="large" step={1} placeholder='Enter a number' style={{ width: '100%' }} />
          </Form.Item>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'flex-end', marginTop: 25 }}>
            <Button type='primary' loading={loading} size='large' htmlType='submit'>Submit</Button>
            <Button type='primary' danger size='large' onClick={() => setOpenDrawer(false)}>Cancel</Button>
          </div>
        </Form>
      </Drawer>
    </>
  )
}

export default InvestmentLiveTransactionsCreateItem