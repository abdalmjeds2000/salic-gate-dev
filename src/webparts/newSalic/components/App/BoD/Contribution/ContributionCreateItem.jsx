import React from 'react';
import { Button, Drawer, Form, Input, InputNumber, message } from 'antd';
import pnp from 'sp-pnp-js';
import { PlusOutlined } from '@ant-design/icons';


const ContributionCreateItem = ({ onFinish }) => {
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (form_values) => {
    setLoading(true);
    try {
      const item_resp = await pnp.sp.web.lists.getByTitle('BoD Contribution').items.add(form_values);
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
          <Form.Item name="Commodity" label="Commodity">
            <Input size="large" placeholder='write here' />
          </Form.Item>
          <Form.Item name="CommodityType" label="Commodity Type">
            <Input size="large" placeholder='write here' />
          </Form.Item>
          <Form.Item name="Year2022" label="Year 2022">
            <InputNumber size="large" placeholder='enter a number' step={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="Year2023" label="Year 2023">
            <InputNumber size="large" placeholder='enter a number' step={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="PortfolioCompany" label="Portfolio Company">
            <Input size="large" placeholder='write here' />
          </Form.Item>
          <Form.Item name="Comments" label="Comments">
            <Input.TextArea size="large" placeholder='write here' rows={4} />
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

export default ContributionCreateItem