import React, { useEffect, useState } from 'react'
import { Button, Form, InputNumber, Space, Tooltip } from 'antd';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';

const btnstyle = {display: 'flex', alignItems: 'center', justifyContent: 'center'};


const EditableDescriptionIndex = ({ value, onFinish }) => {
  const [form] = Form.useForm();
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    form.setFieldValue("DescriptionIndex", value)
  }, [value]);

  const handleUpdateIndex = (values) => {
    setEditMode(false);
    onFinish(values.DescriptionIndex);
  }
  const handleClose = () => {
    form.resetFields();
    setEditMode(false);
  }
  if(!editMode) {
    return <><Tooltip title='Update Index' mouseEnterDelay={0.5}><span className='hover-underline' onClick={() => setEditMode(current => !current)}>{value}</span></Tooltip>{' - '}</>
  }
  return (
    <Form form={form} onFinish={handleUpdateIndex} style={{ display: 'inline-flex', marginRight: 5 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <Form.Item name="DescriptionIndex" initialValue={value} rules={[{required: true, message: ''}]} style={{margin: 0, display: "inline-flex"}}>
          <InputNumber parser={(value) => Math.round(value)} step={1} size='small' placeholder='generated' style={{width: '50px !important'}} />
        </Form.Item>
        <Space.Compact direction='horizontal' size='small'>
          <Button type='primary' htmlType='submit' style={btnstyle}><AiOutlineCheck /></Button>
          <Button danger onClick={handleClose} style={btnstyle}><AiOutlineClose /></Button>
        </Space.Compact>
      </div>
    </Form>
  )
}

export default EditableDescriptionIndex