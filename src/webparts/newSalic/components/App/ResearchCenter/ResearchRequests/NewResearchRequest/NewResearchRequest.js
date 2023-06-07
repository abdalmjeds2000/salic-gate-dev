import React, { useContext, useState } from 'react'
import { Form, Input, Modal, Upload, message, DatePicker, Divider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import HistoryNavigation from '../../../Global/HistoryNavigation/HistoryNavigation';
import { useNavigate } from 'react-router-dom';
import { AppCtx } from '../../../App'
import FormPage from '../../../9Boxs/components/FormPageTemplate/FormPage';
import SubmitCancel from '../../../9Boxs/components/SubmitCancel/SubmitCancel';
import AddResearchRequest from '../API/AddResearchRequest'

const layout = { labelCol: { span: 6 }, wrapperCol: { span: 12 } };

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });





function NewResearchRequest() {
  const { defualt_route, user_data } = useContext(AppCtx);
  let navigate = useNavigate();
  const [form] = Form.useForm();

  const [btnLoader, setBtnLoader] = useState(false)
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState([]);
  const handleCancel = () => setPreviewVisible(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };


  let isFilesFinishUpload = true;
  const attachmentsList = fileList.map(file => {
    if(file.status === "uploading") isFilesFinishUpload = false
    return {
      fileType: file.name.split(".")[file.name.split(".").length-1],
      fileName: file.name,
      path: file.response?.uploadedFiles[0]?.Path
    }
  });


  async function CreateRequest(values) {
    setBtnLoader(true);
    values.AttachmentsRows = JSON.stringify(attachmentsList);
    values.Timeline = new Date(values.Timeline).toLocaleDateString()
    if(values && isFilesFinishUpload) {
      const response = await AddResearchRequest(values)
      if(response.data) {
        form.resetFields();
        message.success("The request has been sent successfully.")
        setFileList([]);
        navigate(`${defualt_route}/research-requests/${response.data.Id}`);
        response.data.Author = { Title: user_data?.Data?.DisplayName, EMail: user_data?.Data?.Mail }
        // setContentRequestsData(prev => [response.data, ...prev]);
        console.log(response);
      } else {
        message.error("Failed to send request.")
      }
    } else {
      message.error("Wait for upload")
    }
    setBtnLoader(false);
  }

  return (
    <>
      <HistoryNavigation>
        <a onClick={() => navigate(`${defualt_route}/research-requests`)}>Research Requests</a>
        <p>New Research Request</p>
      </HistoryNavigation>

      <FormPage
        pageTitle='New Request'
        tipsList={[
          "Fill out required fields carefully.",
          "If Possile upload captured images for the problem.",
          "Be specific in describing the problem you are facing. Please do not write fussy words or incomplete statements.",
          "Be specific in choosing \"Issue Category\" as the system will assign SR. to the appropriate team member.",
        ]}
      >

        <Form
          {...layout} 
          colon={false}
          labelWrap 
          name="research-request" 
          form={form} 
          onFinish={CreateRequest}
          onFinishFailed={() => message.error("Please, fill out the form correctly.")}
        >

          <Form.Item label="Date">
            <Input size='large' disabled defaultValue={new Date().toLocaleString()} />
          </Form.Item>

          <Divider />
          <Form.Item name='Timeline' label="Timeline" rules={[{required: true}]} help="The date you want to recieve a response from research department.">
            <DatePicker format="MM-DD-YYYY" placeholder='mm-dd-yyyy' size='large' />
          </Form.Item>

          <Divider />
          <Form.Item name="Title" label="Research Title" rules={[{required: true}]}>
            <Input placeholder='write here' size='large' />
          </Form.Item>

          <Form.Item name="Descriptions" label="Descriptions" rules={[{required: true}]}>
            <Input.TextArea rows={6} placeholder="write a brief description" />
          </Form.Item>

          <Form.Item label="Documents">
            <Upload   
              action="https://dev.salic.com/api/uploader/up"
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              // beforeUpload={beforeUpload}
              onChange={({ fileList: newFileList }) => setFileList(newFileList)}
            >
              {fileList.length >= 8 ? null : <div><PlusOutlined /><div style={{marginTop: 8,}}>Upload</div></div>}
            </Upload>
            <Modal open={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
              <img alt="example" style={{width: '100%'}} src={previewImage} />
            </Modal>
          </Form.Item>

          <SubmitCancel loaderState={btnLoader} backTo="/research-requests" />
        </Form>
      </FormPage>
    </>
  )
}

export default NewResearchRequest