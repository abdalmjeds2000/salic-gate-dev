import React from 'react';
import { Button, Drawer, Form, Input, message } from 'antd';
import pnp from 'sp-pnp-js';
import { PlusOutlined } from '@ant-design/icons';


const ResolutionByCirculationCreateItem = ({ onFinish }) => {
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (form_values) => {
    setLoading(true);
    try {
      const item_resp = await pnp.sp.web.lists.getByTitle('BoD Resolution By Circulation').items.add(form_values);
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
          <Form.Item name="ResolutionByCirculationNumber" label="Resolution By Circulation Number">
            <Input size="large" placeholder='write here' />
          </Form.Item>
          <Form.Item name="Subject" label="Subject">
            <Input size="large" placeholder='write here' />
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

export default ResolutionByCirculationCreateItem