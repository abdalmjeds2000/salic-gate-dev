import React, { useState } from 'react';
import { Button, Col, Divider, Form, Input, message, Modal, Row, Select } from 'antd';
import { BiLinkAlt } from "react-icons/bi";
import { FaFolder } from "react-icons/fa";
import { FiPlusSquare } from "react-icons/fi";
import axios from 'axios';
import TextArea from 'antd/lib/input/TextArea';


const AddChildAction = ({ byEmail, parentId, onFinish, isRoot }) => {
  const [openModal, setOpenModal] = useState(false)
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [isFolder, setIsFolder] = useState(true);



  const handleAddChild = async (form_data = {}) => {
    setLoading(true);
    const payload = {
      CreatedBy: byEmail,
      ParentId: parentId,
      ...form_data,
    }
    if(isRoot) {
      delete payload.ParentId;
      payload.IsFolder = true;
    }

    const response = await axios.post("https://dev.salic.com/api/reports/Add", payload);

    if(response.data.Status === 200) {
      message.success("New Item has been added successfully");
      form.resetFields();
      setOpenModal(false);
      onFinish();
    } else {
      message.error("Failed");
    }
    
    
    setLoading(false);
  }
  return (
    <>
      {
        !isRoot
        ? <Button 
            type="primary" icon={<FiPlusSquare size={16} />} 
            onClick={() => setOpenModal(true)} 
            style={{ display: "flex", alignItems: "center", gap: 5, }}
          >
            Add Child
          </Button>
        : <Button 
            type="primary" danger icon={<FaFolder size={16} />} 
            onClick={() => setOpenModal(true)} 
            style={{ display: "flex", alignItems: "center", gap: 5 }}
            className='ant-btn-warning'
          >
            Add New Root
          </Button>
        }
      <Modal
        title={<><BiLinkAlt /> {isRoot ? "Add Root Folder" : "Add New Report Hyperlink"}</>}
        open={openModal}
        onCancel={() => setOpenModal(false)}
        destroyOnClose
        footer={null}
      >
        <Form 
          name="add-oracle-report-child" 
          form={form} 
          layout="vertical" 
          onFinish={handleAddChild} onFinishFailed={() => message.error("Fill Form Correctly!")}
        >
          <Form.Item
            label="Name"
            name="Label"
            rules={[{required: true, message: ''}]}
          >
            <Input size='large' maxLength={200} placeholder='write name of new item' />
          </Form.Item>
          {!isRoot &&
            <Form.Item
              label="Child Type"
              name="IsFolder"
              rules={[{required: true, message: ''}]}
              initialValue={true}
            >
              <Select 
                size='large'
                onChange={v => setIsFolder(v)}
                options={[
                  { value: true, label: "Folder" },
                  { value: false, label: "Report" },
                ]}
              />
            </Form.Item>}

          {!isRoot && !isFolder &&
            <Form.Item
              label="Report URL"
              name="Link"
              rules={[{required: true, message: ''}]}
            >
              <TextArea size='large' rows={4} maxLength={5000} />
            </Form.Item>}

          <Divider />

          <Row gutter={3} justify="end">
            <Col>
              <Button type='primary' htmlType='submit' loading={loading} style={{ borderRadius: 5 }}>
                Add
              </Button>
            </Col>
            <Col>
              <Button onClick={() => setOpenModal(false)} style={{ borderRadius: 5 }}>Close</Button>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  )
}

export default AddChildAction