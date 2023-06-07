import { UploadOutlined } from '@ant-design/icons';
import { Button, Form, message, Modal, Row, Select, Upload } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { FaRegNewspaper } from 'react-icons/fa';
import { AppCtx } from '../../../../../../App';



const FileUploder = ({ fileList, setFileList }) => {
  
  return (
    <Upload
      action="https://dev.salic.com/api/uploader/up"
      fileList={fileList}
      onChange={({ fileList: newFileList }) => {
        setFileList(newFileList);
      }}
    >
      <Button type='ghost' size='large' icon={<UploadOutlined />}>Attach Files</Button>
    </Upload>
  )
}



const ReturnAsset = ({ assetData, onSuccessReturn }) => {
  const { user_data } = useContext(AppCtx);
  const [loading, setLoading] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  
  let lastDeliveryNoteId = null;
  let couldBeReturned = null;
  if(Object.keys(assetData)?.length > 0) {
    lastDeliveryNoteId = assetData?.DeliveryNotes[assetData?.DeliveryNotes?.length-1];
    couldBeReturned = lastDeliveryNoteId?.Return;
  }

  let isFilesFinishUpload = true;
  const files = fileList?.map(file => {
    if(file.status === "uploading") isFilesFinishUpload = false
    return file.response?.uploadedFiles[0]?.Name
  });

  const handleReturnAsset = async (form_values) => {
    setLoading(true);

    if(isFilesFinishUpload) { 
      form_values.Email = user_data?.Data?.Mail;
      form_values.DeliveryNoteDetailId = `${lastDeliveryNoteId.Id}`;
      form_values.Files = JSON.stringify(files);

      const response = await axios.post('https://dev.salic.com/api/Asset/ReturenDeliveryNoteId', form_values);
      if(response) {
        message.success("Asset has been return successfully");
        form.resetFields();
        setFileList([]);
        setOpenModal(false);
        onSuccessReturn();
      } else {
        message.error("Failed return Asset")
      }
    } else {
      message.error("Wait For Uploading...");
    }


    setLoading(false);
  }

  if(!couldBeReturned || couldBeReturned?.length > 0) {
    return <></>
  }
  return (
    <>
      <Button type='primary' onClick={() => setOpenModal(true)}>
        Return Asset
      </Button>
      <Modal 
        title={<><FaRegNewspaper /> Return Asset to IT store</>}
        open={openModal} 
        onCancel={() => setOpenModal(false)}
        footer={null}
      >


        <Form 
          form={form} 
          layout='vertical' 
          onFinish={handleReturnAsset} 
          onFinishFailed={() => message.error("Please, fill out the form correctly")}
        >
          <Form.Item name="Notes" label="Notes" rules={[{required: true}]}>
            <TextArea rows={4} placeholder="Write Here" size='large' />
          </Form.Item>

          <Form.Item name="Status" label="Asset Status" initialValue="Good" rules={[{required: true}]}>
            <Select placeholder="Select Status" size='large'>
              <Select.Option value="Good">Good</Select.Option>
              <Select.Option value="Corrupted">Corrupted</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="Reason" label="Return Reason" initialValue="Replace" rules={[{required: true}]}>
            <Select placeholder="Select Reason" size='large'>
              <Select.Option value="Replace">Replace</Select.Option>
              <Select.Option value="Termination">Termination</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Attach Files">
            <FileUploder fileList={fileList} setFileList={setFileList} />
          </Form.Item>


          <div style={{ display: "flex", justifyContent: "flex-end", gap: 5}}>
            <Button type='primary' loading={loading} htmlType='submit' style={{marginBottom: 10}}>Return</Button>
            <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          </div>

        </Form>


      </Modal>
    </>
  )

}

export default ReturnAsset