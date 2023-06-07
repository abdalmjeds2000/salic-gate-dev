import React, { useContext, useState } from 'react';
import { Alert, Col, DatePicker, Divider, Form, Input, InputNumber, message, notification, Row, Select, Typography, Upload } from 'antd';
import { useNavigate } from 'react-router-dom';
import FormPageTemplate from '../../9Boxs/components/FormPageTemplate/FormPage';
import { AppCtx } from '../../App';
import HistoryNavigation from "../../Global/HistoryNavigation/HistoryNavigation";
import moment from "moment";
import TextArea from 'antd/lib/input/TextArea';
import SubmitCancel from '../../9Boxs/components/SubmitCancel/SubmitCancel';
import axios from 'axios';
import { riskType } from '../risksTypes';
import { PlusOutlined } from '@ant-design/icons';
import CustomAntUploader from '../../Global/CustomAntUploader/CustomAntUploader';


const FinancialImpactOptions = [
  { value: 'ActualLoss', labelTitle: "Actual loss", labelDesc: "If the incident resulted in a financial loss" },
  { value: 'PotentialLoss', labelTitle: "Potential loss", labelDesc: "If the incident has been discovered that may or may not result in a financial loss" },
  { value: 'NearMiss', labelTitle: "Near miss", labelDesc: "If the incident was averted. It should be estimated based on an assumption of a financial impact if the incident had occurred" },
];


const NewIncidentReport = () => {
  const { user_data, defualt_route } = useContext(AppCtx);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);



  const SubmitForm = async (dataForm) => {
    let isFilesFinishUpload = true;
    const files = fileList?.map((file) => {
      if (file.status === "uploading") isFilesFinishUpload = false;
      return file?.response?.uploadedFiles[0]?.Name;
    });
    if(!isFilesFinishUpload) return;

    setLoading(true);
    dataForm.RiskTypeName = riskType.filter(row => row.Type == dataForm.RiskType)[0]?.Name || '';
    dataForm.Email = user_data.Data.Mail;
    // dataForm.Id = `${user_data.Data.Id}`;
    dataForm.Id = "0";
    dataForm.DiscoveryDate = moment(dataForm.DiscoveryDate).format('MM/DD/YYYY');
    dataForm.IncidentDate = moment(dataForm.IncidentDate).format('MM/DD/YYYY');
    dataForm.Amount = `${dataForm.Amount ? dataForm.Amount : 0}`;
    dataForm.Files = files.join(',');

    const response = await axios.post('https://dev.salic.com/api/Incidents/Add', dataForm);
    if(response) {
      console.log(response);
      form.resetFields();
      notification.success({message: response.data.Message || 'Success'});
      window.open(defualt_route + '/incidents-center/my-reports');
    } else {
      notification.error({message: 'Failed'});
    }
    setLoading(false);
  }


  let values = riskType.filter((r)=> { return r.Type === formData.RiskType })[0]?.Incident;



  return (
    <>
      <HistoryNavigation>
        <a onClick={() => navigate(`${defualt_route}/incidents-center`)}>Risk Center</a>
        <p>New Incident Report</p>
      </HistoryNavigation>

      <FormPageTemplate
        pageTitle="Incident Report"
        tipsList={[
          "Fill out all required fields marked as ‘*’ carefully.",
          "Incident date is the date in which incident occur.",
          "Discovery date is the date in which incident has been found.",
          "Be specific in choosing \"Risk Type\" & \"Incident Type\" as the system will assign this report to the appropriate team member.",
          "Describe incident completely and precisely.",
        ]}
      >
        <Form
          layout="vertical"
          colon={false}
          form={form}
          labelWrap
          name="incident-report"
          onFinish={SubmitForm}
          onFinishFailed={() => message.error("Please, fill out the form correctly.") }
          onValuesChange={(changedValues, allValues) => setFormData(allValues)}
        >
          <Row gutter={25}>
            <Col xs={24} lg={12}>
              <Row>
                <Col span={24}>
                  <Form.Item name="Number" label="Operational Incident NO." initialValue={"<<auto generated>>"} rules={[{ required: true }]}>
                    <Input placeholder="" size="large" disabled />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item name="Country" label="Country" rules={[{ required: true }]}>
                    <Select placeholder="Select Country" size="large">
                      <Select.Option value="KSA">KSA</Select.Option>
                      <Select.Option value="Ukranie">Ukranie</Select.Option>
                      <Select.Option value="Australia">Australia</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item name="HasFinancialImpact" label="Has Financial Impact" initialValue="False" rules={[{ required: true }]}>
                    <Select placeholder="Select Value" size="large">
                      <Select.Option value="True">Yes</Select.Option>
                      <Select.Option value="False">No</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col xs={24} lg={12}>
              <Row justify="space-between">
                <Col span={24}>
                  <Form.Item /* name="ReportingDate" */ label="Reporting Date">
                    <Input placeholder="" size="large" disabled defaultValue={moment().format('MM/DD/YYYY HH:mm')} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  {formData.Country !== "KSA" && formData.HasFinancialImpact === "True" && 
                    <Form.Item 
                      name="Amount" 
                      initialValue={0}
                      label={<>Amount (<b>SAR</b>)</>} 
                      hasFeedback 
                      help={<span style={{color: 'red'}}>Note : amount should be in <b>SAR</b> and greater than <b>100K</b></span>} 
                      rules={[{ required: true }]}
                    >
                      <InputNumber size="large" min={0} step={1} style={{width: '100%'}} />
                    </Form.Item>}
                </Col>
                <Col span={24}>
                  {formData?.HasFinancialImpact === "True" && 
                    <Form.Item name="FinancialImpactDetails" label="Financial Impact" rules={[{ required: true }]}>
                      <Select placeholder="Select Financial Impact" size="large">
                        {FinancialImpactOptions.map(option => (
                          <Select.Option value={option.value}>
                            <Typography.Text>{option.labelTitle}</Typography.Text> <br />
                            <Typography.Text type='secondary' ellipsis style={{ whiteSpace: 'break-spaces' }}>{option.labelDesc}</Typography.Text>
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>}
                </Col>
              </Row>
            </Col>
            <Divider />
            <Col span={24}>
              {formData.Country !== "KSA" && formData.Amount < 100000 && <Alert
                message="WARNING!"
                description="As there is no financial impact, no need to submit an incident report."
                type="warning"
                showIcon
              />}
            </Col>
            <Col span={24}>
              {(formData.Country === "KSA" || formData.Amount >= 100000) && <Row gutter={25}>
                <Col md={24} lg={12}>
                  <Form.Item name="IncidentDate" label="Incident Date" rules={[{ required: true }]}>
                    <DatePicker size="large" format="MM/DD/YYYY" />
                  </Form.Item>
                </Col>
                <Col md={24} lg={12}>
                  <Form.Item name="DiscoveryDate" label="Discovery Date" rules={[{ required: true }]}>
                    <DatePicker size="large" format="MM/DD/YYYY" />
                  </Form.Item>
                </Col>
                <Col md={24} lg={12}>
                  <Form.Item name="RiskType" label="Risk Type" rules={[{ required: true }]}>
                    <Select placeholder="Select Risk Type" size="large">
                      {riskType?.map((row, i) => <Select.Option key={i} value={row.Type}>{row.Name}</Select.Option>)}
                    </Select>
                  </Form.Item>
                </Col>
                <Col md={24} lg={12}>
                  <Form.Item name="IncidentType" label="Incident Type" rules={[{ required: true }]}>
                    <Select placeholder="Select Incident Type" size="large">
                      {values?.map((row, i) => <Select.Option key={i} value={`${row.id}`}>{row.name}</Select.Option>)}
                    </Select>
                  </Form.Item>
                </Col>
                <Divider />
                <Col span={24}>
                  <Form.Item name="Descriptions" label="Descriptions" rules={[{ required: true }]}>
                    <TextArea rows={6} placeholder='A detailed description of the incident' />
                  </Form.Item>
                </Col>
                <Divider />
                <Col span={24}>
                  <Form.Item label="Attachments">
                    {/* <Upload   
                      action="https://dev.salic.com/api/uploader/up"
                      listType="picture-card"
                      fileList={fileList}
                      onChange={({ fileList: newFileList }) => setFileList(newFileList)}
                    >
                      {fileList?.length >= 8 ? null : <div><PlusOutlined /><div style={{marginTop: 8,}}>Upload</div></div>}
                    </Upload> */}
                    <CustomAntUploader
                      fileList={fileList}
                      GetFilesList={(files) => setFileList(files)}
                    />
                  </Form.Item>
                </Col>

                <div style={{margin: '10px auto'}}>
                  <SubmitCancel loaderState={loading} backTo="/incidents-center" />
                </div>
              </Row>}
            </Col>
          </Row>
        </Form>
      </FormPageTemplate>
    </>
  )
}

export default NewIncidentReport