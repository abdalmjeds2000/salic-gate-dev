import React, { useContext, useState } from 'react';
import { FileProtectOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Col, Form, message, Modal, notification, Radio, Row, Space, Upload } from 'antd'
import TextArea from 'antd/lib/input/TextArea';
import { AppCtx } from '../../../App';
import MarkAsDoneRequest from './MarkAsDoneRequest';


function MarkAsDoneAction({ RequestType, ModalTitle, onSuccess, idName, idVal }) {
  const { user_data } = useContext(AppCtx);
  const [form] = Form.useForm();
  const [openModal, setOpenModal] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  const [isShowing, setIsShowing] = useState(true);



  const TakeAction = async (form_values) => {
    setBtnLoading(true);

    let isFilesFinishUpload = true;
    const files = fileList.map(file => {
      if(file.status === "uploading") isFilesFinishUpload = false
      return file.response?.uploadedFiles[0]?.Name
    });
    const originalFiles = fileList.map(file => file.originFileObj.name);

    if(isFilesFinishUpload) {
      form_values.ByUser = user_data.Data.Mail;
      form_values.Files = files.join();
      form_values.OriginalFiles = originalFiles.join();

      var form_data = new FormData();
      for(let key in form_values) {
        form_data.append(key, form_values[key]);
      }
      form_data.append(idName, idVal);
      if(idName == "VISAId") {
        form_data.append('WF_Status', "0");
        form_data.append('Reason', "1");
        form_data.append('Type', "ACK");
      }

      const response = await MarkAsDoneRequest(RequestType, form_data);
      if(response?.status == 200) {
        setOpenModal(false);
        form.resetFields();
        setFileList([]);
        setIsShowing(false);
        notification.success({message: response?.data?.Message || "success"});
        onSuccess(); 
      } else {
        message.error("Failed take your action.")
      }
      
    } else {
      message.error("Wait For Uploading...")
    }

    setBtnLoading(false);
  }



  return (
    <div>
      {isShowing && 
        <Button 
          type='primary' 
          size='middle' 
          disabled={btnLoading} 
          onClick={() => setOpenModal(true)}
          className='ant-btn-success'
        >Close</Button>}
      <Modal
        title={<><FileProtectOutlined /> {ModalTitle}</>}
        open={openModal} 
        onCancel={() => setOpenModal(false)}
        footer={false}
        destroyOnClose
      >
        <Form
          name="admin-request-action" 
          layout="vertical"
          form={form}
          onFinish={TakeAction}
          onFinishFailed={() => message.error("Please, fill out the form correctly.")}
        >
          <Form.Item name="ActionStatus" label="Status" rules={[{required: true}]}>
            <Radio.Group>
              <Space direction='vertical'>
                <Radio value="1">Approve</Radio>
                <Radio value="2">Reject</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="notes" label="Feedback" rules={[{required: true}]}>
            <TextArea rows={4} placeholder="Write Here"></TextArea>
          </Form.Item>
          
          <Form.Item label="Attach Files">
            <Upload
              action="https://dev.salic.com/api/uploader/up"
              fileList={fileList}
              onChange={({ fileList: newFileList }) => setFileList(newFileList)}
            >
              <Button type='ghost' icon={<UploadOutlined />}>Attach Files</Button>
            </Upload>
          </Form.Item>
          <Row justify="end" align="middle" gutter={[10, 10]}>
            <Col>
              <Button type='primary' htmlType='submit' disabled={btnLoading} className='ant-btn-success'>
                Close
              </Button>
            </Col>
            <Col>
              <Button type='default' onClick={() => setOpenModal(false)}>Cancel</Button>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  )
}

export default MarkAsDoneAction