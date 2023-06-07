import React, { useContext, useEffect, useState } from 'react';
import { Form, Input, Upload, Select, DatePicker, InputNumber, Modal, message, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import HistoryNavigation from '../../../Global/HistoryNavigation/HistoryNavigation';
import FormPage from '../../components/FormPageTemplate/FormPage';
import SubmitCancel from '../../components/SubmitCancel/SubmitCancel';
import { AppCtx } from '../../../App';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import VisitorRequest from './API/VisitorRequest';
import GetVisitorRequestById from './API/GetVisitorRequestById';
import ActionsTable from '../../components/ActionsTable/ActionsTable';
import FileIcon from '../../../Global/RequestsComponents/FileIcon';
import {NationaltiesOptions} from '../../../Global/NationaltiesOptions/NationaltiesOptions'
import MarkAsDoneAction from '../AddAction/MarkAsDoneAction';
import AntdLoader from '../../../Global/AntdLoader/AntdLoader';
import useIsAdmin from '../../../Hooks/useIsAdmin';
import AssignAction from '../AddAction/AssignAction';
import HoldAction from '../AddAction/HoldAction';

const { Option } = Select;
const layout = { labelCol: { span: 6 }, wrapperCol: { span: 12 } };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });


function Visitor() {
  const { user_data, defualt_route } = useContext(AppCtx);
  let navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const { id } = useParams();
  const [requestData, setRequestData] = useState({});

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
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const [isAdmin] = useIsAdmin("Visitor VISA Admins");
  const [isAdminUser] = useIsAdmin("Admin Users");


  async function CreateVisitorRequest(values) {
    setBtnLoading(true);

    let isFilesFinishUpload = true;
    const files = fileList.map(file => {
      if(file.status === "uploading") isFilesFinishUpload = false
      return file.response?.uploadedFiles[0]?.Name
    }).join(",");

    if(values && isFilesFinishUpload) {
      values.ExpectedDateArrival = moment(values.ExpectedDateArrival).format('MM/DD/YYYY');
      const form_values = {
        Email: user_data?.Data?.Mail,
        ReferenceCode: "auto generated",
        Files: files,
        Id: "0",
        ...values
      }
      var form_data = new FormData();
      for ( var key in form_values ) {
        form_data.append(key, form_values[key]);
      }
      const response = await VisitorRequest(form_data);
      if(response?.status == 200) {
        form.resetFields();
        setFileList([]);
        notification.success({message: response?.data?.Message || "Your Application has been submitted successfully."})
        if(response?.data?.Data) {
          navigate(defualt_route + "/admin-services/my-requests");
          window.open(defualt_route + '/admin-services/visitor/' + response?.data?.Data);
        }
      } else {
        message.error("Failed to send request.")
      }
    } else {
      message.error("Wait for upload")
    }
    setBtnLoading(false);
  }

  async function GetVisitorRequestData() {
    setLoading(true);
    const response = await GetVisitorRequestById(user_data.Data.Mail, id);
    if(response.data.Status === 200 && response.data.Data.length > 0) {
      document.title = `.:: SALIC Gate | ${response.data.Data[0].ReferenceCode || "Visitor Request"} ::.`
      setRequestData(response.data.Data[0])
    } else {
      message.error("Error Get Request Data")
    }
    setLoading(false);
  }

  useEffect(() => {
    if(id) {
      if(Object.keys(user_data).length > 0 && Object.keys(requestData).length === 0) {
        GetVisitorRequestData();
      }
    } else {
      setLoading(false);
    }
  }, [user_data])





  let isAllowActions;
  requestData?.Status?.forEach(item => {
    if(item.Type === "ACTION" && item.StatusLabel === "Pending" && item?.ToUser?.Mail?.toLowerCase() === user_data?.Data?.Mail.toLowerCase()) {
      isAllowActions = true;
    }
  });
  let lastStatus = requestData?.Status?.length > 0 ? requestData?.Status[requestData?.Status?.length - 1] : {};


  return (
    <>
      <HistoryNavigation>
        <a onClick={() => navigate(`${defualt_route}/admin-services`)}>Admin Service</a>
        <p>{!id && 'New '}Visitor VISA Request</p>
      </HistoryNavigation>
      
      {
        !loading
        ? <FormPage
            pageTitle={!id ? 'New VISA Visitor Request' : requestData.ReferenceCode}
            Header={
              id && lastStatus.Type !== "FIN" && isAdminUser
              ? <>
                  {isAdmin && <AssignAction
                    RequestId={requestData.Id}
                    RequestType="Visitor"
                    onSuccess={GetVisitorRequestData} />}
                  {isAllowActions ? <HoldAction
                    RequestId={requestData.Id}
                    RequestType="Visitor"
                    onSuccess={GetVisitorRequestData} /> : null}
                  {isAllowActions ? <MarkAsDoneAction
                    RequestType="Visitor" 
                    ModalTitle={`.:: ${requestData.ReferenceCode} ::.`} 
                    idName="Id" idVal={requestData.Id} 
                    onSuccess={GetVisitorRequestData} /> : null} 
                </>
              : null
            }
            Email={id ? requestData?.ByUser?.Mail : user_data?.Data?.Mail}
            UserName={id ? requestData?.ByUser?.DisplayName : user_data?.Data?.DisplayName}
            UserTitle={id ? requestData?.ByUser?.Title : user_data?.Data?.Title}
            UserDept={id ? requestData?.ByUser?.Department : user_data?.Data?.Department}
            UserNationality={id ? requestData?.ByUser?.Nationality : user_data?.Data?.Nationality || ' - '}
            UserId={id ? requestData.ByUser?.Iqama || ' - ' : user_data.Data?.Iqama || ' - '}
            EmployeeId={id ? parseInt(requestData.ByUser?.PIN, 10) || ' - ' : parseInt(user_data.Data?.PIN, 10) || ' - '}
            Extension={id ? requestData.ByUser?.Ext || ' - ' : user_data.Data?.Ext || ' - '}    
            tipsList={[
              "Fill out required fields carefully.",
              "Check your email regularly. You will receive a notification on every future actions",
            ]}
          >
            <Form 
              {...layout} 
              colon={false}
              labelWrap 
              name="visitor-request" 
              layout="horizontal"
              form={form} 
              onFinish={CreateVisitorRequest}
              onFinishFailed={() => message.error("Please, fill out the form correctly.")}
            >

              <Form.Item name='Date' label="Date" rules={[{required: true,}]} initialValue={moment(id ? new Date(requestData.CreatedAt) : new Date()).format('MM/DD/YYYY hh:mm')} >
                <Input placeholder='Date' size='large' disabled />
              </Form.Item>
              
              <hr />

              <Form.Item name="NameOfVisitor" label="Name Of Visitor" rules={[{required: true}]} initialValue={id ? requestData.NameOfVisitor : ''}>
                <Input placeholder='full name' size='large' disabled={id ? true : false} />
              </Form.Item>
              <Form.Item name="Nationality" label="Nationality" rules={[{required: true,}]}>
                <Select
                  showSearch
                  placeholder="Nationality"
                  filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                  size="large"
                  disabled={id ? true : false}
                  defaultValue={id ? requestData.Nationality : ''}
                >
                  {NationaltiesOptions?.map((item, i) => <Select.Option key={i} value={item.value}>{item.label}</Select.Option>)}
                </Select>
              </Form.Item>
              <Form.Item name="Profession" label="Profession" rules={[{required: true}]} initialValue={id ? requestData.Profession : ''}>
                <Input placeholder='job title, or job field' size='large' disabled={id ? true : false} />
              </Form.Item>
              <Form.Item name="Description" label="Company and Address" initialValue={id ? requestData.Description : ''}>
                <Input.TextArea rows={6} placeholder="write a brief description" disabled={id ? true : false}/>
              </Form.Item>
              <Form.Item name="ExpectedDateArrival" label="Expected Date Arrival">
                {
                  !id
                  ? <DatePicker placeholder='mm-dd-yyyy' format='MM-DD-YYYY' size='large'/>
                  : <Input size='large' disabled defaultValue={moment(requestData.ExpectedDateArrival).format("MM-DD-YYYY")}/>
                }
              </Form.Item>
              <Form.Item name="TypeVISA" initialValue="Single" label="Type VISA" rules={[{required: true,}]}>
                <Select
                  showSearch
                  placeholder=""
                  filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                  size="large"
                  defaultValue={id ? requestData.TypeVISA : "Single"}
                  disabled={id ? true : false}
                >
                  <Option value="Single" selected>Single</Option>
                  <Option value="Multiple">Multiple</Option>
                </Select>
              </Form.Item>
              <Form.Item name="SaudiEmbassy" label="Saudi Embassy Location" rules={[{required: true}]} initialValue={id ? requestData.SaudiEmbassy : ''}>
                <Input placeholder='the location of Saudi Embassy' size='large' disabled={id ? true : false}/>
              </Form.Item>



              <Form.Item name="Period" label="Period Of Visit (days)" initialValue={id ? requestData.Period : 1} rules={[{required: true,}]}>
                <InputNumber size="large" min={-1000000} max={1000000} placeholder="Period Of Visit (days)" disabled={id ? true : false}/>
              </Form.Item>
              {
                !id
                ? <Form.Item label="Attach">
                    <Upload
                      action="https://dev.salic.com/api/uploader/up"
                      listType="picture-card"
                      fileList={fileList}
                      onPreview={handlePreview}
                      onChange={handleChange}
                    >
                      {fileList.length >= 8 ? null : <div><PlusOutlined /><div style={{marginTop: 8,}}>Upload</div></div>}
                    </Upload>
                    <Modal open={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
                      <img alt="example" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                  </Form.Item>
                : <Form.Item label="Attach">
                    {
                      requestData.Files.map((file,i) => {
                          return (
                              <FileIcon
                                  key={i} 
                                  FileType={file.Guid.split(".")[file.Guid.split(".").length-1]}
                                  FileName={file.Guid}
                                  FilePath={file.Path}
                                  IconWidth='100px'
                              />
                          )
                      })
                    }
                  </Form.Item>
              }


              {!id && <SubmitCancel loaderState={btnLoading} isUpdate={id ? true : false} backTo="/admin-services" />}
            </Form>
            {
              id && 
              <div className='admin-services-table'>
                <ActionsTable ActionData={requestData.Status || []} />
              </div>
            }
          </FormPage>
        : <AntdLoader />
      }
        
    </>
  )
}

export default Visitor