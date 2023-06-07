import React from 'react';
import { Button, Drawer, Form, Input, Select, message } from 'antd';
import pnp from 'sp-pnp-js';
import TextArea from 'antd/lib/input/TextArea';
import AddSelectItem from '../../9Boxs/ITServices/Assets/components/AddSelectItem';
import { PlusOutlined } from '@ant-design/icons';


const InvestmentPipelineCreateItem = ({ onFinish }) => {
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const [platformList, setPlatformList] = React.useState(['Grains', 'Green Fooder', 'Diversified', 'Animal Protein']);
  const [stageList, setStageList] = React.useState(['Moderate', 'Early', 'Advanced']);
  const [statusList, setStatusList] = React.useState(['Active', 'Dormant', 'Archived']);
  
  const handleSubmit = async (form_values) => {
    setLoading(true);
    try {
      const item_resp = await pnp.sp.web.lists.getByTitle('BoD Investement Pipeline').items.add(form_values);
      setLoading(false);
      if(onFinish) onFinish(item_resp?.data);
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
          <Form.Item name="ProjectName" label="Project Name">
            <Input size="large" placeholder='write here' />
          </Form.Item>
          <Form.Item name="Platform" label="Platform">
            <Select
              placeholder="Select a platform" size="large"
              options={platformList?.map((item) => ({label: item, value: item }))}
              dropdownRender={menu => <AddSelectItem menu={menu} setItems={setPlatformList} />}
            />
          </Form.Item>
          <Form.Item name="Commodity" label="Commodity">
            <TextArea rows={4} size='large' placeholder='write here' />
          </Form.Item>
          <Form.Item name="Country" label="Country">
            <TextArea rows={4} size='large' placeholder='write here' />
          </Form.Item>
          <Form.Item name="DealSize" label="Deal Size">
            <Input size="large" placeholder='write here' />
          </Form.Item>
          <Form.Item name="SALICOwn" label="SALIC Own" initialValue={'0'}>
            <Input size="large" placeholder='write here' />
          </Form.Item>
          <Form.Item name="StakeRange" label="Stake Range">
            <TextArea rows={4} size='large' placeholder='write here' />
          </Form.Item>
          <Form.Item name="CommodityCoverage" label="Commodity Coverage">
            <TextArea rows={4} size='large' placeholder='write here' />
          </Form.Item>
          <Form.Item name="CompletionDate" label="Completion Date">
            <Input size="large" placeholder='write here' />
          </Form.Item>
          <Form.Item name="Sign_x002d_offstatus" label="Sign-off status">
            <Input size="large" placeholder='write here' />
          </Form.Item>
          <Form.Item name="Stage" label="Stage">
            <Select
              placeholder="Select a stage" size="large"
              options={stageList?.map((item) => ({label: item, value: item }))}
              dropdownRender={menu => <AddSelectItem menu={menu} setItems={setStageList} />}
            />
          </Form.Item>
          <Form.Item name="Status" label="Status">
            <Select
              placeholder="Select status" size="large"
              options={statusList?.map((item) => ({label: item, value: item }))}
              dropdownRender={menu => <AddSelectItem menu={menu} setItems={setStatusList} />}
            />
          </Form.Item>
          <Form.Item name="RecentDiscussions" label="Recent Discussions">
            <TextArea rows={4} size='large' placeholder='write here' />
          </Form.Item>
          <Form.Item name="NextSteps" label="Next Steps">
            <TextArea rows={4} size='large' placeholder='write here' />
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

export default InvestmentPipelineCreateItem