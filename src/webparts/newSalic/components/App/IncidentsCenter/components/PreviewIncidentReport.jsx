import React, { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Alert, Avatar, Button, Col, DatePicker, Descriptions, Divider, Form, Image, Input, InputNumber, List, message, notification, Radio, Row, Select, Steps, Typography } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { AppCtx } from '../../App';
import AntdLoader from '../../Global/AntdLoader/AntdLoader';
import HistoryNavigation from '../../Global/HistoryNavigation/HistoryNavigation';
import Section from '../../Global/RequestsComponents/Section';
import moment from 'moment';
import { riskType } from '../risksTypes';
import ToggleButton from '../../Global/ToggleButton';
import { CgMoreO } from 'react-icons/cg';
import { AiOutlineNumber } from 'react-icons/ai';
import { TbCalendarMinus, TbSend } from 'react-icons/tb';
import { MdEmojiFlags } from 'react-icons/md';
import { BiMoney, BiRightArrowAlt } from 'react-icons/bi';
import { RiFileList3Line, RiSkullLine } from 'react-icons/ri';
import { FiFileText } from 'react-icons/fi';
import UserColumnInTable from '../../Global/UserColumnInTable/UserColumnInTable';
import { TiInfoOutline } from 'react-icons/ti';
import { GoInfo } from 'react-icons/go';
import { FaRegCommentDots } from 'react-icons/fa';
import { ImAttachment } from 'react-icons/im';
import DropdownSelectUser from '../../Global/DropdownSelectUser/DropdownSelectUser';
import { ReviewTips, TipsForDepartment } from './PreviewIncidentReport/tips';
import ProtectRouteIncident from '../../../Routers/ProtectRoutes/ProtectRouteIncident';
import ApprovalModal from './PreviewIncidentReport/ApprovalModal';
import CloseModal from './PreviewIncidentReport/CloseModal';
import CustomAntUploader from '../../Global/CustomAntUploader/CustomAntUploader';
import FileIcon from '../../Global/RequestsComponents/FileIcon';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import useIsAdmin from '../../Hooks/useIsAdmin';



const contentStyle = {
  fontSize: "1rem",
};
const labelStyle = {
  fontWeight: "500",
};
const descriptionStyle = {
  display: "block",
  maxHeight: "300px",
  overflow: "auto",
  whiteSpace: "break-spaces",
};
function hasDepartmentDuplicates(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i].ResponsibleDepartment === arr[j].ResponsibleDepartment) {
        return true;
      }
    }
  }
  return false;
}

const PreviewIncidentReport = () => {
  const { user_data, defualt_route, salic_departments } = useContext(AppCtx);
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [riskDepartmentForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [error, setError] = useState(false);
  const [reportData, setReportData] = useState({});
  const [showOperationalLossForm, setShowOperationalLossForm] = useState(false);
  const [isAdmin] = useIsAdmin("Incident_Admin");

  const [fileList, setFileList] = useState([]);
  let isFilesFinishUpload = true;
  const files = fileList?.map((file) => {
    if (file.status === "uploading") isFilesFinishUpload = false;
    return file?.response?.uploadedFiles[0]?.Name;
  });


  // Fetch Report By Id
  const getReportById = async () => {
    setLoading(true);
    const response = await axios.get(`https://dev.salic.com/api/Incidents/GetById?Id=${id}`)
    if(response?.status == 200 && response?.data?.Status == 200) {
      // const x = response.data.Data;
      // x.Status = "ForApproval"
      // x.FinancialImpact = 1;

      // const x = response.data.Data;
      // x.Status = "REVIEW"

      setReportData(response.data.Data);
      setShowOperationalLossForm(response.data.Data.FinancialImpact == 1);
      document.title = `.:: SALIC Gate | Incident Report #${response.data.Data.Number} ::.`;
    } else {
      setError(true);
    }
    setLoading(false);
  }
  useEffect(() => {
    if(id) {
      getReportById();
    } else {
      navigate(defualt_route + "/incidents-center");
    }
  } , []);


  // POST: Assign & DepartmentRespond
  const submitData = async (values) => {
    setBtnLoading(true);
    let data = values;

    data.Email = user_data?.Data?.Mail;
    data.Id = `${reportData.Id}`;

    if(reportData?.Status === 'REVIEW') {
      if(data?.data?.length) {
        if(hasDepartmentDuplicates(data?.data)) {
          setBtnLoading(false);
          notification.error({message: "Failed:", description: "Because a department was selected more than once"})
          return;
        }
      }
    } else {
      if(data.RecoveryDate) data.RecoveryDate = moment(data.RecoveryDate).format('MM/DD/YYYY');
      if(data.ResolutionTargetDate) data.ResolutionTargetDate = moment(data.ResolutionTargetDate).format('MM/DD/YYYY');
      if(data.LossAmount) data.LossAmount = `${data.LossAmount}`;
      if(data.RecoveryAmount) data.RecoveryAmount = `${data.RecoveryAmount}`;
      if(data.RecoveryAmount) data.RecoveryAmount = `${data.RecoveryAmount}`;
    }
    const response = await axios({
      method: "POST",
      url: `https://dev.salic.com/api/Incidents/` + (reportData?.Status === 'REVIEW' ? 'Assign' : 'DepartmentRespond'),
      data: data,
    });
    if(response?.status == 200 || response?.status == 201) {
      getReportById();
      notification.success({message: response.data.Message || "success"})
    } else {
      notification.error({message: "failed"})
    }
    setBtnLoading(false);
  }


  // handle LossAmountField & RecoveryAmountField (RecoveryAmountField always should be less than LossAmountField);
  const limitRecoveryAmount = () => {
    const LossAmountField = form.getFieldValue("LossAmount") || 0;
    const RecoveryAmountField = form.getFieldValue("RecoveryAmount");
    if(RecoveryAmountField > LossAmountField) {
      form.setFieldValue("RecoveryAmount", form.getFieldValue("LossAmount"))
    }
  }

  // Toggle Properties Section (show and hide in mobile size)
  const propertiesSectionRef = useRef();
  const handleShowDetails = (v) => {
    propertiesSectionRef.current.style.display = 
    propertiesSectionRef.current.style.display === "block" ? "none" : "block";
  }

  const isPendingWithApproval = reportData?.Status === "PENDING_WITH_DEPARTMENT";

  const riskDepartmentFeedback = reportData?.riskDepartmentFeedback?.filter(item => item?.ResponsibleDepartment?.toLowerCase() === user_data?.Data?.Department?.toLowerCase())[0] || {};

  if(error) {
    return <Alert
      message="Error"
      description="Something is wrong, please check that the link above is correct or make sure you are connected to the Internet."
      type="error"
      showIcon
      style={{ margin: "100px 25px"}}
    />
  }
  return (
    <>
      <HistoryNavigation>
        <a onClick={() => navigate(`${defualt_route}/incidents-center`)}>Risk Center</a>
        <p>New Incident Report</p>
      </HistoryNavigation>


      <div className='preview-request-container'>
        <div className="header">
          <h1>Incident Report: #{reportData?.Number}</h1>
          {(Object.keys(reportData).length > 0 && isAdmin) && 
            <div>
              {reportData?.Status === "ForApproval" && <ApprovalModal id={`${reportData.Id}`} onSuccess={getReportById} />}
              {!["CLOSED", "CLOSEDEARLY"].includes(reportData?.Status) ? <CloseModal id={`${reportData.Id}`} onSuccess={getReportById} /> : null}
              <span className='properties-toggle-btn'>
                <ToggleButton 
                  icon={<CgMoreO />}
                  title="more information"
                  callback={handleShowDetails}
                />
              </span>
            </div>}
        </div>
        {
          !loading
          ? (
            <div className='content'>
              <div className='timeline'>
                <div className='report-information-tables'>
                  <Typography.Text style={{ display: 'block', fontSize: '1.5rem', marginBottom: 15, fontWeight: "500" }}><TiInfoOutline /> Report Information: </Typography.Text>
                  <Descriptions size='small' labelStyle={labelStyle} contentStyle={contentStyle} layout="vertical" bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
                    <Descriptions.Item label={<><AiOutlineNumber /> Operational Incident NO.</>}>{reportData?.Number || ' - '}</Descriptions.Item>
                    <Descriptions.Item label={<><TbCalendarMinus /> Reporting Date</>}>{moment(reportData?.ReportingDate).format('YYYY-MM-DD HH:mm') || ' - '}</Descriptions.Item>
                    <Descriptions.Item label={<><TbCalendarMinus /> Incident Date</>}>{moment(reportData?.IncidentDate).format('YYYY-MM-DD') || ' - '}</Descriptions.Item>
                    <Descriptions.Item label={<><TbCalendarMinus /> Discovery Date</>}>{moment(reportData?.DiscoveryDate).format('YYYY-MM-DD') || ' - '}</Descriptions.Item>
                  </Descriptions>
                  <br />
                  <Descriptions size='small' labelStyle={labelStyle} contentStyle={contentStyle} layout="vertical" bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
                    <Descriptions.Item label={<><MdEmojiFlags /> Country</>} span={1}>{reportData?.Country || ' - '}</Descriptions.Item>
                    <Descriptions.Item label={<><BiMoney /> Has Financial Impact</>}>{reportData?.HasFinancialImpact ? 'True' : 'False' || ' - '}</Descriptions.Item>
                    {reportData?.HasFinancialImpact && <Descriptions.Item label={<><BiMoney /> Financial Impact</>}>{reportData?.FinancialImpactDetails || ' - '}</Descriptions.Item>}
                    <Descriptions.Item label={<><BiMoney /> Amount (SAR)</>}>{reportData?.Amount || ' 0 '}</Descriptions.Item>
                    <Descriptions.Item label={<><RiSkullLine /> Risk Type</>}>{riskType?.filter(r=> r.Type == reportData.RiskType)[0]?.Name || ' - '}</Descriptions.Item>
                    <Descriptions.Item label={<><RiFileList3Line /> Incident Type</>}>{riskType?.filter(r=> r.Type == reportData.RiskType)[0]?.Incident?.filter(x=> x.id == reportData.IncidentType)[0]?.name || ' - '}</Descriptions.Item>
                  </Descriptions>
                  <br />
                  <Descriptions size='small' labelStyle={labelStyle} contentStyle={contentStyle} layout="vertical" bordered>
                    <Descriptions.Item contentStyle={descriptionStyle} label={<><FiFileText /> Descriptions</>} span={1}>{<div dangerouslySetInnerHTML={{ __html: reportData?.Descriptions }}></div> || ' - '}</Descriptions.Item>
                  </Descriptions>
                  <br />
                  {!["CLOSED", "CLOSEDEARLY"].includes(reportData?.Status) && 
                    <Descriptions size='small' labelStyle={labelStyle} contentStyle={contentStyle} layout="vertical" bordered>
                      <Descriptions.Item contentStyle={descriptionStyle} label={<><ImAttachment /> Upload Attachments</>} span={1}>
                        <CustomAntUploader
                          fileList={fileList}
                          GetFilesList={(files) => setFileList(files)}
                        />
                        <br />
                        {(files.length > 0 && isFilesFinishUpload) && <Button type='primary'>Upload Files</Button>}
                      </Descriptions.Item>
                    </Descriptions>}
                </div>
                <div>
                  {/* <Typography.Text style={{ display: 'block', fontSize: '1.5rem', marginBottom: 15, fontWeight: "500" }}><GoInfo /> Risk Department Feedback: </Typography.Text>
                  <Descriptions size='small' labelStyle={labelStyle} contentStyle={contentStyle} layout="vertical" bordered column={1}>
                    <Descriptions.Item label={<><FaRegCommentDots /> Risk Department Comments</>}>{reportData?.RiskDepartmentComment || ' - '}</Descriptions.Item>
                    <Descriptions.Item label={<><TbSend /> Refer to</>}>
                      <div style={{display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap"}}>
                        <UserColumnInTable Mail={reportData?.AssignedBy?.Mail} DisplayName={reportData?.AssignedBy?.DisplayName } />
                        <BiRightArrowAlt />
                        <UserColumnInTable Mail={reportData?.AssignTo?.Mail} DisplayName={reportData?.AssignTo?.DisplayName } NameDescription={reportData?.ResponsibleDepartment} />
                      </div>
                    </Descriptions.Item>
                  </Descriptions> */}
                  {
                    ["PENDING_WITH_DEPARTMENT", "ForApproval", "CLOSED", "SentForApproval"].includes(reportData?.Status)
                    && (
                      <>
                        <Typography.Text style={{ display: 'block', fontSize: '1.5rem', marginBottom: 15, fontWeight: "500" }}><GoInfo /> Risk Department Feedback: </Typography.Text>
                        <Descriptions size='small' labelStyle={labelStyle} contentStyle={contentStyle} layout="vertical" bordered column={1}>
                          <Descriptions.Item label={<><FaRegCommentDots /> Risk Department Comments</>}>{riskDepartmentFeedback?.RiskDepartmentComment || ' - '}</Descriptions.Item>
                          <Descriptions.Item label={<><TbSend /> Refer to</>}>
                            <div style={{display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap"}}>
                              <UserColumnInTable Mail={reportData?.AssignedBy?.Mail} DisplayName={reportData?.AssignedBy?.DisplayName } />
                              <BiRightArrowAlt />
                              <UserColumnInTable Mail={riskDepartmentFeedback?.AssignTo?.Mail} DisplayName={riskDepartmentFeedback?.AssignTo?.DisplayName } NameDescription={riskDepartmentFeedback?.ResponsibleDepartment} />
                            </div>
                          </Descriptions.Item>
                        </Descriptions>
                      </>
                    )
                  }
                  {
                    ["REVIEW", "SentForApproval"].includes(reportData?.Status)
                    && (
                      <div className='department-part'>
                        <Form 
                          name="risk-department-part" 
                          layout="vertical"
                          form={riskDepartmentForm} 
                          onFinish={submitData}
                          onFinishFailed={() => message.error("Please, fill out the form correctly.")}
                        >
                          <Typography.Text type='danger' style={{ display: 'block', fontSize: '1.5rem', marginBottom: 15, fontWeight: "500" }}><GoInfo /> Risk Department Part: </Typography.Text>
                          
                          <div>
                            <Form.Item>
                              <Form.List
                                name="data"
                                rules={[{
                                  validator: async (_, items) => {
                                    if (!items || items.length < 1) {
                                      return Promise.reject();
                                    }},
                                }]}
                              >
                                {(fields, { add, remove }, { errors }) => (
                                  <>
                                    {fields?.map((field, index) => (
                                      <Row gutter={[15, 0]} style={{ padding: 10, borderRadius: 5, border: '1px solid #eee', marginBottom: 10 }}>
                                        <Col span={24}>
                                          <Form.Item name={[field.name, "RiskDepartmentComment"]} label="Risk Department Comments" rules={[{required: true, message: ""}]}>
                                            <Input.TextArea size='large' rows={4} placeholder="comments from reviewers" />
                                          </Form.Item>
                                        </Col>
                                        <Col xs={24} lg={12}>
                                          <Form.Item name={[field.name, "ResponsibleDepartment"]} label="Responsible Department" rules={[{required: true, message: ""}]}>
                                            <Select
                                              showSearch
                                              removeIcon
                                              size='large'
                                              placeholder="Select a department"
                                              optionFilterProp="children"
                                              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase()) }
                                              options={[
                                                { value: 'IT', label: 'Department Of IT', },
                                                ...salic_departments.filter(item => item !== "").map(item => ({ label: item, value: item }))
                                              ]}
                                            />
                                          </Form.Item>
                                        </Col>
                                        <Col xs={24} lg={12}>
                                          <Form.Item label={<><Typography.Text type='danger'>*</Typography.Text> Assign Respondent</>}>
                                            <DropdownSelectUser name={[field.name, "AssignTo"]} placeholder="select person name" required={true} />
                                          </Form.Item>
                                        </Col>
                                        <Col span={24} style={{display: 'flex', justifyContent: 'flex-end'}}>
                                          {fields.length > 1 ? (
                                            <Button danger icon={<MinusCircleOutlined />} onClick={() => remove(field.name)}>Remove</Button>
                                          ) : null}
                                        </Col>
                                      </Row>
                                    ))}
                                    <Button
                                      type="dashed"
                                      onClick={() => add()}
                                      onLoad={add}
                                      style={{width: '100%', marginTop: 25}}
                                      size='large'
                                      icon={<PlusOutlined />}
                                    >
                                      Add Department
                                    </Button>
                                    <Form.ErrorList errors={errors} />
                                  </>
                                )}
                              </Form.List>
                            </Form.Item>

                            <Row justify="end" gutter={10}>
                              <Col>
                                <Button htmlType='submit' type='primary' loading={btnLoading}>Assign</Button>
                              </Col>
                              <Col>
                                <Button type='primary' danger onClick={() => navigate(defualt_route + "/incidents-center")}>Cancel</Button>
                              </Col>
                            </Row>
                          </div>

                          {/* <Row gutter={[15, 15]}>
                            <Col span={24}>
                              <Form.Item name="RiskDepartmentComment" label="Risk Department Comments" rules={[{required: true}]}>
                                <Input.TextArea size='large' rows={6} placeholder="comments from reviewers" />
                              </Form.Item>
                            </Col>
                            <Col xs={24} lg={12}>
                              <Form.Item name="ResponsibleDepartment" label="Responsible Department" rules={[{required: true}]}>
                                <Select
                                  showSearch
                                  removeIcon
                                  size='large'
                                  placeholder="Select a department"
                                  optionFilterProp="children"
                                  filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase()) }
                                  options={[
                                    { value: 'IT', label: 'Department Of IT', },
                                    ...salic_departments.filter(item => item !== "").map(item => ({ label: item, value: item }))
                                  ]}
                                />
                              </Form.Item>
                            </Col>
                            <Col xs={24} lg={12}>
                              <Form.Item label={<><Typography.Text type='danger'>*</Typography.Text> Assign Respondent</>}>
                                <DropdownSelectUser name="AssignTo" placeholder="select person name" required={true} />
                              </Form.Item>
                            </Col>
                            <Col span={24}>
                              <Row justify="end" gutter={10}>
                                <Col>
                                  <Button htmlType='submit' type='primary' loading={btnLoading}>Assign</Button>
                                </Col>
                                <Col>
                                  <Button type='primary' danger onClick={() => navigate(defualt_route + "/incidents-center")}>Cancel</Button>
                                </Col>
                              </Row>
                            </Col>
                          </Row> */}
                        </Form>
                      </div>
                    )
                  }
                </div>
                <div>
                  {
                    ["PENDING_WITH_DEPARTMENT", "ForApproval", "CLOSED", "SentForApproval"].includes(reportData?.Status)
                    && (
                      <div className='department-part'>
                        <Typography.Text type='danger' style={{ display: 'block', fontSize: '1.5rem', marginBottom: 20, fontWeight: "500" }}>
                          <GoInfo /> Responsible Department Part: 
                        </Typography.Text>
                        {Object.keys(reportData).length > 0 
                          ? (
                            <Form 
                              name="responsible-department-part" 
                              layout="vertical"
                              form={form} 
                              onFinish={submitData}
                              onFinishFailed={() => message.error("Please, fill out the form correctly.")}
                            >
                              <Form.Item name="Causes" label="Cause" rules={[{required: true}]} initialValue={reportData?.Causes || ""}>
                                <Input.TextArea size='large' rows={6} placeholder="what led to the incident" disabled={!isPendingWithApproval} />
                              </Form.Item>


                              {/* <Form.Item name="Actions" label="Action Plan / Action Taken" rules={[{required: true}]} initialValue={reportData?.Actions || ""}>
                                <Input.TextArea size='large' rows={6} placeholder="write action taken" disabled={!isPendingWithApproval} />
                              </Form.Item> */}
                              <Row gutter={[24, 24]}>
                                <Col xs={24} lg={12}>
                                  <Form.Item name="ActionPlan" label="Action Plan" rules={[{required: true}]} initialValue={reportData?.ActionPlan || ""}>
                                    <Input.TextArea size='large' rows={6} placeholder="write action plan" disabled={!isPendingWithApproval} />
                                  </Form.Item>
                                </Col>
                                <Col xs={24} lg={12}>
                                  <Form.Item name="ActionTaken" label="Action Taken" rules={[{required: true}]} initialValue={reportData?.ActionTaken || ""}>
                                    <Input.TextArea size='large' rows={6} placeholder="write action taken" disabled={!isPendingWithApproval} />
                                  </Form.Item>
                                </Col>
                              </Row>

                              <Form.Item name="FinancialImpact" label="Financial Impact" rules={[{required: true}]} initialValue={reportData?.FinancialImpact || 2}>
                                <Radio.Group size='large' disabled={!isPendingWithApproval} onChange={e => setShowOperationalLossForm(e.target.value == 1)}>
                                  <Radio value={1}>Yes</Radio>
                                  <Radio value={2}>No</Radio>
                                </Radio.Group>
                              </Form.Item>
                              <Form.Item name="ActionParty" label="Action By" rules={[{required: true}]} initialValue={reportData?.ActionParty || "IT"}>
                                <Select
                                  showSearch
                                  removeIcon
                                  size='large'
                                  disabled={!isPendingWithApproval}
                                  placeholder="Select a department"
                                  optionFilterProp="children"
                                  filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase()) }
                                  options={[
                                    { value: 'IT', label: 'Department Of IT', },
                                    ...salic_departments.filter(item => item !== "").map(item => ({ label: item, value: item }))
                                  ]}
                                />
                              </Form.Item>
                              <Form.Item name="ResolutionTargetDate" label="Resolution Target Date" rules={[{required: true}]} initialValue={moment(reportData?.ResolutionTargetDate ? new Date(reportData?.ResolutionTargetDate) : new Date())}>
                                <DatePicker size='large' format='MM/DD/YYYY' disabled={!isPendingWithApproval} />
                              </Form.Item>


                              {showOperationalLossForm ? <div>
                                <Divider />
                                <Typography.Text style={{ display: 'block', fontSize: '1.2rem', marginBottom: 12, fontWeight: "500" }}>Operational Loss Form: </Typography.Text>

                                <Form.Item name="LossAmount" label="Loss Amount" rules={[{required: true}]} initialValue={reportData?.LossAmount || ""}>
                                  <InputNumber 
                                    style={{width: "100%"}} 
                                    size="large" 
                                    placeholder="Select Loss Amount & Currency"
                                    onChange={limitRecoveryAmount}
                                    disabled={!isPendingWithApproval}
                                    addonAfter={
                                      <Form.Item name="LossAmountCurrency" disabled={!isPendingWithApproval} initialValue={reportData?.LossAmountCurrency !== null ? reportData?.LossAmountCurrency : "SAR"} style={{margin: 0}}>
                                        {/* <CurrencySelectInput /> */}
                                        <Select disabled={!isPendingWithApproval} style={{ minWidth: 100 }} size="large">
                                          <Select.Option value="USD">US Dollar</Select.Option>
                                          <Select.Option value="AUD">Australian Dollar</Select.Option>
                                          <Select.Option value="EUR">Euro</Select.Option>
                                          <Select.Option value="SAR">Saudi Riyal</Select.Option>
                                          <Select.Option value="UAH">Ukrainian hryvnia</Select.Option>
                                          <Select.Option value="CAD">Canadian Dollar</Select.Option>
                                          <Select.Option value="INR">Indian Rupee</Select.Option>
                                        </Select>
                                      </Form.Item>
                                    } 
                                  />
                                </Form.Item>
                                <Form.Item name="RecoveryAmount" label="Recovery Amount" rules={[{required: true}]} initialValue={reportData?.RecoveryAmount || ""}>
                                  <InputNumber 
                                    style={{width: "100%"}} 
                                    size="large" 
                                    placeholder="Select Recovery Amount & Currency"
                                    onChange={limitRecoveryAmount}
                                    disabled={!isPendingWithApproval}
                                    addonAfter={
                                      <Form.Item name="RecoveryAmountCurrency" disabled={!isPendingWithApproval} initialValue={reportData?.RecoveryAmountCurrency !== null ? reportData?.RecoveryAmountCurrency : "SAR"} style={{margin: 0}}>
                                        <Select disabled={!isPendingWithApproval} style={{ minWidth: 100 }} size="large">
                                          <Select.Option value="USD">US Dollar</Select.Option>
                                          <Select.Option value="AUD">Australian Dollar</Select.Option>
                                          <Select.Option value="EUR">Euro</Select.Option>
                                          <Select.Option value="SAR">Saudi Riyal</Select.Option>
                                          <Select.Option value="UAH">Ukrainian hryvnia</Select.Option>
                                          <Select.Option value="CAD">Canadian Dollar</Select.Option>
                                          <Select.Option value="INR">Indian Rupee</Select.Option>
                                        </Select>
                                      </Form.Item>
                                    } 
                                  />
                                </Form.Item>
                                <Form.Item name="IfNotRecovered" label="If Amount Not Recovered Now, Is it Expected in the Future?" rules={[{required: true}]} initialValue={reportData?.IfNotRecovered || 2}>
                                  <Radio.Group size='large' disabled={!isPendingWithApproval}>
                                    <Radio value={1}>Yes</Radio>
                                    <Radio value={2}>No</Radio>
                                  </Radio.Group>
                                </Form.Item>
                                <Form.Item name="RecoveryDate" label="Recovery Date" rules={[{required: true}]} initialValue={reportData?.RecoveryDate ? moment(new Date(reportData?.RecoveryDate)) : ""}>
                                  <DatePicker size='large' format='MM/DD/YYYY' disabled={!isPendingWithApproval} />
                                </Form.Item>
                                <Form.Item name="EnsureAction" label="Actions Taken To Ensure Loss Will Not Be Repeated" rules={[{required: true}]} initialValue={reportData?.EnsureAction || ""}>
                                  <Input.TextArea size='large' disabled={!isPendingWithApproval} rows={6} placeholder="Actions Taken To Ensure Loss Will Not Be Repeated" /* disabled={} *//>
                                </Form.Item>
                              </div> : null}

                              {isPendingWithApproval && <Col span={24}>
                                <Row justify="end" gutter={10}>
                                  <Col>
                                    <Button htmlType='submit' type='primary' loading={btnLoading}>Submit</Button>
                                  </Col>
                                  <Col>
                                    <Button type='primary' danger onClick={() => navigate(defualt_route + "/incidents-center")}>Cancel</Button>
                                  </Col>
                                </Row>
                              </Col>}
                            </Form>
                          ) : null}
                      </div>
                    )
                  }
                </div>
              </div>
              <div className='properties' ref={propertiesSectionRef}>
                <Section SectionTitle="Tips">
                  <List
                    size="small"
                    dataSource={
                      ["PENDING_WITH_DEPARTMENT", "ForApproval", "CLOSED"].includes(reportData?.Status)
                      ? TipsForDepartment
                      : ReviewTips
                    }
                    renderItem={(item) => <List.Item>{item}</List.Item>}
                  />
                </Section>
                <Section SectionTitle="Attached Files">
                  <div className='attachments-container'>
                    {reportData?.Files?.map((file,i) => {
                      return (
                        <FileIcon
                          key={i} 
                          FileType={file?.FileName?.split(".")[file.FileName?.split(".")?.length-1]}
                          FileName={file?.FileName}
                          FilePath={`https://dev.salic.com/File/${file?.Guid}`}
                          IconWidth='45px'
                        />
                      )
                    })}
                    {(reportData?.Files?.length === 0 || !reportData?.Files) ? <Typography.Text>No attachments for this report</Typography.Text> : null }
                  </div>
                </Section>
                <Section SectionTitle="Actions History">
                  <AssigneesRender items={reportData.ActionsHistory || []} />
                </Section>
              </div>
            </div>
          ) : (
            <AntdLoader />
          )
        }
      </div>
    </>
  )
}

export default PreviewIncidentReport;




const UserImage = ({ email }) => (
  <Avatar
    // size="small"
    src={
      <Image
        src={`/sites/newsalic/_layouts/15/userphoto.aspx?size=s&username=${email}`}
        preview={{src: `/sites/newsalic/_layouts/15/userphoto.aspx?size=L&username=${email}`,}}
      />
    }
    style={{marginRight: 8}}
  />
)

const AssigneesRender = ({ items }) => (
  <Steps
    direction="vertical"
    size="small" 
    status="process" 
    current={items.length}
  >
    {
      items.map((item, i) => (
        <Steps.Step 
          key={i}
          title={
            <div style={{display: "flex", gap: 10}}>
              <div style={{ width: 28 }}>
                <UserImage email={item?.ByUser?.Mail} />
              </div>
              <div style={{ width: "100%" }}>
                {item?.Action} by <b>{item?.ByUser?.DisplayName}</b>
                , at {moment(item?.CreatedAt).format('MM/DD/YYYY hh:mm A')}
              </div>
            </div>
          } 
          // subTitle={`at ${new Date(requestData.CreatedAt).toLocaleString()}`} 
          style={{paddingBottom: 15}}
        />
      ))
    }
  </Steps>
)