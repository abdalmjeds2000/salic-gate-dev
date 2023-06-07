import React, { useContext, useEffect, useRef, useState } from 'react';
import './PreviewRequest.css';
import HistoryNavigation from '../../Global/HistoryNavigation/HistoryNavigation';
import { useNavigate, useParams } from 'react-router-dom';
import { AppCtx } from '../../App'
import { Button, Col, message, Row, Timeline, Upload, Steps, Modal, Alert, Typography, Checkbox } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { CaretRightOutlined, CheckOutlined, CloseOutlined, UploadOutlined } from '@ant-design/icons';
import Reply from '../../Global/RequestsComponents/Reply';
import Section from '../../Global/RequestsComponents/Section';
import SenderImg from '../../Global/RequestsComponents/SenderImg';
import GetContentRequest from '../API/GetContentRequest';
import UpdateContentRequest from '../API/UpdateContentRequest';
import GetContentRequestAssigneeHistory from '../API/GetContentRequestAssigneeHistory';
import AddNewReply from '../API/AddNewReply';
import GetReplys from '../API/GetReplys';
import FileIcon from '../../Global/RequestsComponents/FileIcon';
import UpdateAssignee from '../API/UpdateAssignee';
import moment from 'moment';
import AntdLoader from '../../Global/AntdLoader/AntdLoader';
import ToggleButton from '../../Global/ToggleButton';
import { CgMoreO } from 'react-icons/cg';

function PreviewContentRequest() {
    let { id } = useParams();
    const { user_data, defualt_route } = useContext(AppCtx);
    const navigate = useNavigate();
    const [fileList, setFileList] = useState([]);
    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
    const [newReplyText, setNewReplyText] = useState("");
    const [loading, setLoading] = useState(true);
    const [btnLoader, setBtnLoader] = useState(false);
    const [requestData, setRequestData] = useState({});
    const [replys, setReplys] = useState([]);
    const [assigneeHistoryData, setAssigneeHistoryData] = useState([]);
    const [openApproveModal, setOpenApproveModal] = useState(false);
    const [openRejectModal, setOpenRejectModal] = useState(false);
    const [openCancelModal, setOpenCancelModal] = useState(false);
    const [openSubmitModal, setOpenSubmitModal] = useState(false);
    const [actionNote, setActionNote] = useState('');
    const [checkboxReply, setCheckboxReply] = useState(false);
    const [previousAttachment, setPreviousAttachment] = useState([]);

    // check if there files is uploading...
    let isFilesFinishUpload = true;
    const attachmentsList = fileList.map(file => {
        if(file.status === "uploading") isFilesFinishUpload = false
        return {
            fileType: file.name.split(".")[file.name.split(".").length-1],
            fileName: file.name, 
            path: file.response?.uploadedFiles[0]?.Path
        }
    });



    // Get Content Request by {id} and display it on preview
    async function GetRequest(id) {
        setBtnLoader(true);
        const response = await GetContentRequest(id);        
        if(response) {
            document.title = `.:: SALIC Gate | ${response.Title} ::.`;
            response.AttachmentsRows = JSON.parse(response.AttachmentsRows);
            setRequestData(prev => {return {...response}});
        } else {
            console.log("ERROR :: Get Content Request");
        }
        setBtnLoader(false);
    } 
    // Get All Replys for {id} request
    async function GetAllReplys(id) {
        const response = await GetReplys(id);
        if(response) {
            setReplys(response);
        } else {
            console.log("ERROR :: Get All Replys", response);
        }
    }
    // Get Assignee For Request of id === {id}
    async function GetRequestAssigneeHistory(id) {
        const AssigneeHistory = await GetContentRequestAssigneeHistory(id);
        if(AssigneeHistory) {
            setAssigneeHistoryData(AssigneeHistory);
            console.log(AssigneeHistory);
        } else {
            console.log("ERROR :: Get Assignee History", AssigneeHistory);
        }
    }
    // Add New Reply
    async function AddReply(ReplyText, IsResult, ResultStatus, IsShowToRequester) {
        setBtnLoader(true);
        if(ReplyText && isFilesFinishUpload) {
            const replyJSON = {
                Title: requestData.Title,
                RequestIDId: id,
                Descriptions: ReplyText,
                AttachmentsRows: JSON.stringify([...attachmentsList, ...previousAttachment]),
                IsResult: IsResult,
                ResultStatus: ResultStatus,
                ShowToRequester: IfRequester ? true : IsShowToRequester
            }
            const response = await AddNewReply(replyJSON)
            if(response.data) {
                let res = response.data;
                res.Author = {
                    EMail: user_data.Data?.Mail,
                    Title: user_data.Data?.DisplayName
                }
                setReplys(prev => [...prev, res]);
                setNewReplyText('');
                setFileList([]);
            } else {
                message.error("Failed Add Reply!")
            }
        }
        setBtnLoader(false);
    }
    // Add New Action (Approved or Rejected or Submit)
    async function AddAction(status) {
        setBtnLoader(true);
        if(isFilesFinishUpload) {
            const RequestStatus = status==="Submit" ? "Approved" : status;
            const data = {Status: RequestStatus, ActionDate: new Date()}
            const response = await UpdateAssignee(data, PendingAssignee?.Id)
            if(response) {
                GetRequestAssigneeHistory(id);
                if(status === "Submit") {
                    AddReply(actionNote, false, null, true);
                    setOpenSubmitModal(false);
                    message.success(`Your Content has been Submitted Seccessfully.`, 1.5);
                } else if(status === "Approved" || status === "Rejected") {
                    AddReply(actionNote, true, status, true);
                    setOpenApproveModal(false);
                    setOpenRejectModal(false);
                    message.success(`Action completed successfully.`, 1.5);
                }
            } else {
                message.error("Failed Add Action!")
            }
        } else {
            message.error("Wait for Uploading...")
        }
        setFileList([]);
        setBtnLoader(false);
    }
    // Update Request (Acknowledge or Cancel)
    async function UpdateRequest(newData, id, withReply) {
        setBtnLoader(true);
        const data = newData;
        const response = await UpdateContentRequest(data, id);
        if(response && withReply) {
            if(isFilesFinishUpload) {
                message.success(`Done!`);
                AddReply(actionNote, false, null, true);
                setRequestData(prev => {prev.Status = newData.Status; return prev});
            } else {
                message.error("Wait for Uploading ...");
            }
        }
        setBtnLoader(false);
    }


    // Send Get's Requests (when page is rendered)
    useEffect(() => {
        if(id) {
            setLoading(true);
            GetRequest(id)
            .then(() => {
                GetRequestAssigneeHistory(id);
                GetAllReplys(id);
            })
            .then(() => setLoading(false));
        } else {
            navigate(defualt_route + '/content-requests/new-request');
            message.info("Not Found Item")
        }
    }, []);



    // Replys Uploader Component
    const ReplyUploader = (
        <Upload 
            action="https://dev.salic.com/api/uploader/up"
            fileList={fileList}
            onChange={handleChange}
        >
            <Button size='middle' icon={<UploadOutlined />}>Attach Files</Button>
        </Upload>
    )
    // Checkbox If Show Reply To Requester  Component
    const CheckboxReply = () => <Checkbox onClick={() => setCheckboxReply(!checkboxReply)} value={checkboxReply}>Do you want the Requester to see this reply?</Checkbox>

    // Approve Modal Component
    const ApproveModal = () => {
        const ParseReplysAttachments = replys.map(reply => JSON.parse(reply.AttachmentsRows).map(row => {row.Author = reply.Author; row.Created = reply.Created; return {...row}}));
        const ReplysAttachments = [].concat.apply([], ParseReplysAttachments);
        return (
            <Modal
                title='Write a note before Approve'
                open={openApproveModal}
                onCancel={() => setOpenApproveModal(false)}
                okButtonProps={{ style: {display: 'none'}}}
            >
                <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                    <TextArea value={actionNote} onChange={e => setActionNote(e.target.value)} placeholder='write something' />
                    <Typography.Text disabled>* You can choose one or more documents already attached to this request, or you can upload new one.</Typography.Text>
                    <div className='attachments-container'>
                        {
                            ReplysAttachments.map((file, i) => (
                                <Checkbox key={i} onChange={e => {
                                    if(e.target.checked) {
                                        setPreviousAttachment(prev => [...prev, file])
                                    } else {
                                        const updateSelectedFiles = previousAttachment.filter(f => f.path !== file.path);
                                        setPreviousAttachment(updateSelectedFiles);
                                    }
                                }}>
                                    <div style={{display: 'flex', gap: '5px', backgroundColor: '#f5f5f5', padding: '4px', borderRadius: '5px', alignItems: 'center'}}>
                                        <FileIcon
                                            FileType={file.fileType}
                                            FileName={file.fileName}
                                            FilePath={file.path}
                                            IconWidth='25px'
                                        />
                                        <div style={{fontSize: '0.8rem', lineHeight: 1.2}}>
                                            <Typography.Text strong>{file.fileName}</Typography.Text><br />
                                            <Typography.Text type="secondary">by {file.Author.Title}, at {moment(file.Created).format('MM/DD/YYYY hh:mm')}</Typography.Text>
                                        </div>
                                    </div>
                                </Checkbox>
                        
                            ))
                        }
                    </div>
                    {ReplyUploader}
                    <Button 
                        type="primary" 
                        onClick={() => AddAction("Approved")} 
                        disabled={actionNote.length === 0 || btnLoader}
                    >
                        Approve Request
                    </Button>
                </div>
            </Modal>
        )
    }
    // Reject Modal Component
    const RejectModal = () => (
        <Modal
            title='Write Rejection Reason'
            open={openRejectModal}
            onCancel={() => setOpenRejectModal(false)}
            okButtonProps={{ style: {display: 'none'}}}
        >
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                <TextArea value={actionNote} onChange={e => setActionNote(e.target.value)} placeholder='write something' />
                {ReplyUploader}
                <Button 
                    type="primary" 
                    onClick={() => AddAction("Rejected")} 
                    disabled={actionNote.length === 0 || btnLoader}
                    danger
                >
                    Reject Request
                </Button>
            </div>
        </Modal>
    )
    // Submit Modal Component
    const SubmitModal = () => (
        <Modal
            title='Submit Your Content'
            open={openSubmitModal}
            onCancel={() => setOpenSubmitModal(false)}
            okButtonProps={{ style: {display: 'none'}}}
        >
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                <TextArea value={actionNote} onChange={e => setActionNote(e.target.value)} placeholder='write something' />
                {ReplyUploader}
                <Button 
                    type="primary" 
                    onClick={() => AddAction("Submit")} 
                    disabled={actionNote.length === 0 || btnLoader}
                >
                    Submit Content
                </Button>
            </div>
        </Modal>
    )
    // Cancel Modal Component
    const CancelModal = () => (
        <Modal
            title='Cancel Your Request'
            open={openCancelModal}
            onCancel={() => setOpenCancelModal(false)}
            okButtonProps={{ style: {display: 'none'}}}
            footer={false}
        >
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                <TextArea value={actionNote} onChange={e => setActionNote(e.target.value)} placeholder='write cancel reason' />
                {ReplyUploader}
                <Button 
                    type="primary" 
                    onClick={() => UpdateRequest({Status: "Cancel"}, id, true)} 
                    disabled={actionNote.length === 0 || btnLoader}
                    danger
                >
                    Cancel Request
                </Button>
            </div>
        </Modal>
    )



    // Get Current Assignee for current user
    let PendingAssignee = assigneeHistoryData?.filter(a => a.Status === "Pending" && a.ToUser?.EMail === user_data.Data?.Mail)[0];
    // check if current user is requester or not
    let IfRequester = requestData?.Author?.EMail === user_data?.Data?.Mail;
    // filter replys by current user (if approval (return *) if requester (return replys by proparaty 'ShowToRequester'))
    let FilteredReplys = IfRequester ? replys.filter(r => r.ShowToRequester) : replys;
    
    // remove value from textbox when any modal open or close
    useEffect(() => {
        setActionNote("");
    }, [openCancelModal, openApproveModal, openRejectModal, openSubmitModal])


    // Get Unique Assignee History for steps and dont show "acknowledge assignee" (because it for requester)
    const AssigneeOrders = [];
    const UniqueAssigneeSteps = assigneeHistoryData.filter(a => {
        if(a.Action !== "Acknowledge") {
            const isDuplicate = AssigneeOrders.includes(a.ApprovalOrder);
            if (!isDuplicate) {
                AssigneeOrders.push(a.ApprovalOrder);
                return true
            }
            return false;
        }
    })






    // Toggle Properties Section (show and hide in mobile size)
    const propertiesSectionRef = useRef();
    const handleShowDetails = (v) => {
        propertiesSectionRef.current.style.display = 
        propertiesSectionRef.current.style.display === "block" ? "none" : "block";
    }

    return (
    <>
        <HistoryNavigation>
            <a onClick={() => navigate(`${defualt_route}/content-requests`)}>Content Requests</a>
            <p>Preview Request</p>
        </HistoryNavigation>
        
        <div className='preview-request-container'>
            <div className="header">
                <h1>Content Request: [#{requestData?.Id || '###'}]</h1>
                <div>
                    {
                        requestData.Status === 'Submitted' && PendingAssignee?.Status === "Pending"
                        ?   (
                                PendingAssignee?.Action === "Approve"
                                ?   <div>
                                        <Button onClick={() => {setOpenApproveModal(true)}} type="primary" disabled={btnLoader}>Approve</Button>
                                        <Button onClick={() => {setOpenRejectModal(true)}} type="primary" disabled={btnLoader} danger>Reject</Button>
                                        {ApproveModal()}
                                        {RejectModal()}
                                    </div>
                                : PendingAssignee?.Action === "Submit"
                                ?   <div>
                                        <Button onClick={() => setOpenSubmitModal(true)} type="primary" disabled={btnLoader}>Submit</Button>
                                        {SubmitModal()}
                                    </div>
                                :   null
                            )
                        :   null
                    }
                    {
                        IfRequester && requestData.Status === 'Approved' && PendingAssignee?.Status === "Pending"
                        ?   <Button onClick={() => {AddAction("Approved"); setRequestData(prev => {prev.Status="Acknowledge"; return prev})}} type="primary" disabled={btnLoader}>Acknowledge</Button>
                        :   IfRequester && requestData.Status === 'Submitted'
                        ?   <>
                                <Button onClick={() => setOpenCancelModal(true)} type="primary" disabled={btnLoader} danger>Cancel Request</Button>
                                {CancelModal()}
                            </>
                        :   null
                    }

                    <span className='properties-toggle-btn'>
                        <ToggleButton
                            icon={<CgMoreO />}
                            title="more information"
                            callback={handleShowDetails}
                        />
                    </span>
                </div>
            </div>
        {
            !loading
            ?   (
                    assigneeHistoryData?.length > 0
                    ?   <div className='content'>
                            <div className='timeline'>
                                <Timeline>
                                    <div className="request-reply">
                                        <Timeline.Item dot={<SenderImg Email={requestData.Author?.EMail} Name={requestData.Author?.Title} />}>
                                            <Reply 
                                                Title={<>RE: {requestData?.Title}, <Typography.Text type="secondary" style={{fontSize: '0.8rem'}}>by {requestData.Author?.Title}</Typography.Text></>}
                                                Description={`${requestData?.RequestType}, ${new Date(requestData?.Created).toLocaleString()}`} 
                                            >
                                                {requestData?.Descriptions}
                                            </Reply>
                                        </Timeline.Item>
                                    </div>
                                    {
                                        FilteredReplys?.map((reply, i) => {
                                            return (
                                                <div className={(reply.Author?.EMail === user_data.Data?.Mail) ? "my-reply" : ""}>
                                                    <Timeline.Item 
                                                        key={i}
                                                        dot={<SenderImg Email={reply.Author.EMail} Name={reply.Author.Title} />}
                                                    >
                                                        <Reply 
                                                            Title={reply.Author?.Title} 
                                                            Description={new Date(reply.Created).toLocaleString()}
                                                            Files={JSON.parse(reply.AttachmentsRows)}
                                                            IsReason={reply.IsResult}
                                                            RequestStatus={reply.ResultStatus}
                                                        >
                                                            {reply.Descriptions}
                                                        </Reply>
                                                    </Timeline.Item>
                                                </div>
                                            )
                                        })
                                    }
                                    {
                                        ["Submitted", "Approved"].includes(requestData?.Status) &&
                                        <div className="add-reply">
                                            <Timeline.Item dot={<SenderImg Email={user_data.Data?.Mail} Name={user_data.Data?.DisplayName} />}>
                                                <Row gutter={[10, 10]}>
                                                    <Col span={24}>                            
                                                        <TextArea rows={4} placeholder="Add Reply" maxLength={500} value={newReplyText} onChange={e => setNewReplyText(e.target.value)} />
                                                    </Col>
                                                    <Col span={24}>
                                                        {!(openApproveModal||openCancelModal||openRejectModal||openSubmitModal) && ReplyUploader}
                                                    </Col>
                                                    {!IfRequester && 
                                                    <Col span={24}>
                                                        {!IfRequester && CheckboxReply()}
                                                    </Col>}
                                                    <Col span={24}>
                                                        <Button type='primary' onClick={() => AddReply(newReplyText, false, null, checkboxReply)} disabled={btnLoader}>Add Feedback</Button>
                                                    </Col>
                                                </Row>
                                            </Timeline.Item>
                                        </div>
                                    }
                                </Timeline>
                            </div>

                            <div className='properties' ref={propertiesSectionRef}>
                                <Section SectionTitle="Request Type">
                                    <div>
                                        {requestData.RequestType}
                                    </div>
                                </Section>
                                <Section SectionTitle="Attached Files">
                                    <div className='attachments-container'>
                                        {
                                            requestData.AttachmentsRows.map((file,i) => {
                                                return (
                                                    <FileIcon
                                                        key={i} 
                                                        FileType={file.fileType}
                                                        FileName={file.fileName}
                                                        FilePath={file.path}
                                                        IconWidth='50px'
                                                    />
                                                )
                                            })
                                        }
                                        {
                                            requestData.AttachmentsRows.length === 0
                                            ? <Typography.Text disabled>No Attachments</Typography.Text>
                                            : null
                                        }

                                        {/* <FilePdfOutlined /><FileJpgOutlined /><FileWordOutlined /> */}
                                    </div>
                                </Section>
                                <Section SectionTitle="Requset Status">
                                    <Steps 
                                        direction="vertical"
                                        size="small" 
                                        status={["Rejected", "Cancel"].includes(requestData.Status) ? "error" : "process"} 
                                        current={requestData?.Status === "Submitted" ? assigneeHistoryData.length : assigneeHistoryData.length+1}
                                    >
                                        <Steps.Step 
                                            title="Submitted"
                                            subTitle={`at ${new Date(requestData.Created).toLocaleString()}`}
                                        />
                                        {   
                                            UniqueAssigneeSteps?.map((row, i) => {
                                                if(row.Action == "Approve") {
                                                    return  <Steps.Step 
                                                                key={i}
                                                                title={<b><CaretRightOutlined />{row.ToUser?.Title}</b>} 
                                                                subTitle={<>at {new Date(row.Created).toLocaleString()}</>}
                                                                description={row.ActionDate ? <>{row.ToUser?.Title} <b>{row.Status}</b> this Request at {new Date(row.ActionDate).toLocaleString()}</> : "Request is now being Reviewed."}
                                                            />
                                                } else if(row.Action == "Submit") {
                                                    return  <Steps.Step 
                                                                key={i}
                                                                title={<b><CaretRightOutlined /> Media Team</b>} 
                                                                subTitle={<>at {new Date(row.Created).toLocaleString()}</>}
                                                                description={null}
                                                            />
                                                }
                                                
                                            })
                                        }
                                        {
                                            requestData?.Status !== "Submitted" &&
                                            <Steps.Step 
                                                title={<b>{requestData?.Status}</b>} 
                                                description={`Request #${id} has been ${requestData?.Status}.`} 
                                                progressDot={(dot, { status, index }) => (
                                                    <span>{dot} {["Rejected", "Cancel"].includes(requestData.Status) ? <CloseOutlined /> : <CheckOutlined />}</span>
                                                )}
                                            />
                                        }
                                    </Steps>
                                </Section>
                            </div>
                        </div>
                    :   <Alert
                            message="Your Request is being Submitted"
                            description="Please wait a few moments, then try again."
                            type="info"
                            showIcon
                            action={<Button size="small" type="primary" onClick={() => navigate(defualt_route+'/content-requests')}>Back</Button>}
                        />
                )
            :   <AntdLoader />
        }
        </div>
    </>
    )
}

export default PreviewContentRequest