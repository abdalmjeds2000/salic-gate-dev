import React, { useContext, useEffect, useState } from 'react';
import '../../../ContentRequests/PreviewRequest/PreviewRequest.css';
import HistoryNavigation from '../../../Global/HistoryNavigation/HistoryNavigation';
import { useNavigate, useParams } from 'react-router-dom';
import { AppCtx } from '../../../App'
import { Button, Col, message, Row, Timeline, Upload, Steps, Spin, Modal, Alert, Checkbox, Typography } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { CaretRightOutlined, CheckOutlined, CloseOutlined, LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import Reply from '../../../Global/RequestsComponents/Reply';
import Section from '../../../Global/RequestsComponents/Section';
import SenderImg from '../../../Global/RequestsComponents/SenderImg';
import GetResearchRequest from '../API/GetReserchRequest';
import AddNewReply from '../API/AddNewReply';
import GetResearchReplys from '../API/GetResearchReplys';
import FileIcon from '../../../Global/RequestsComponents/FileIcon';
import GetResearchRequestAssignee from '../API/GetResearchRequestAssignee';
import UpdateAssignee from '../API/UpdateAssignee';
import UpdateResearchRequest from '../API/UpdateResearchRequest';
import AntdLoader from '../../../Global/AntdLoader/AntdLoader';

function PreviewResearchRequest() {
    let { id } = useParams();

    const { user_data, defualt_route } = useContext(AppCtx);
    const navigate = useNavigate();
    const [fileList, setFileList] = useState([]);
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
    const [actionNote, setActionNote] = useState('')
    const [checkboxReply, setCheckboxReply] = useState(false)

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


    // Get Research Request by {id} and display it on preview
    async function GetRequest(id) {
        setBtnLoader(true);
        const response = await GetResearchRequest(id);        
        if(response) {
            document.title = `.:: SALIC Gate | ${response.Title} ::.`;
            response.AttachmentsRows = JSON.parse(response.AttachmentsRows);
            setRequestData(prev => {return {...response}});
        } else {
            console.log("ERROR :: Get Research Request");
        }
        setBtnLoader(false);
    } 
    // Get All Replys for {id} request
    async function GetAllReplys(id) {
        const response = await GetResearchReplys(id);
        if(response) {
            setReplys(response);
        } else {
            console.log("ERROR :: Get All Replys", response);
        }
    }
    // Get Assignee For Request of id === {id}
    async function GetRequestAssigneeHistory(id) {
        const AssigneeHistory = await GetResearchRequestAssignee(id);
        if(AssigneeHistory) {
            setAssigneeHistoryData(AssigneeHistory);
            console.log(AssigneeHistory);
        } else {
            console.log("ERROR :: Get Assignee History", AssigneeHistory);
        }
    }
    // Add New Reply
    async function AddReply(ReplyText, IsResult, ResultStatus) {
        setBtnLoader(true);
        if(ReplyText && isFilesFinishUpload) {
            const replyJSON = {
                Title: requestData.Title,
                RequestIDId: id,
                Descriptions: ReplyText,
                AttachmentsRows: JSON.stringify(attachmentsList),
                IsResult: IsResult,
                ResultStatus: ResultStatus,
                ShowToRequester: IfRequester ? true : checkboxReply
            }
            const response = await AddNewReply(replyJSON)
            if(response.data) {
                let res = response.data;
                res.Author = {
                    EMail: user_data.Data.Mail,
                    Title: user_data.Data.DisplayName
                }
                setReplys(prev => [...prev, res]);
                setNewReplyText('');
                setFileList([]);
            } else {
                message.error("Failed Add Reply!")
            }
        } else {
            message.error(!newReplyText ? "Write Something and try again." : "Wait for Uploading ...")
        }
        setBtnLoader(false);
    }
    // Add New Action (Approved or Rejected or Submit) -> from approvals
    async function AddAction(status) {
        setBtnLoader(true);
        if(isFilesFinishUpload) {
            const RequestStatus = status==="Submit" ? "Approved" : status;
            const data = {Status: RequestStatus, ActionDate: new Date()}
            const response = await UpdateAssignee(data, PendingAssignee?.Id)
            if(response) {
                GetRequestAssigneeHistory(id);
                if(status === "Submit") {
                    AddReply(actionNote, false);
                    message.success(`Your Content has been Submit Seccessfully.`, 3);
                    setOpenSubmitModal(false);
                } else {
                    AddReply(actionNote, true, status);
                    message.success(`The request has been ${status}.`, 3)
                    setOpenApproveModal(false);
                    setOpenRejectModal(false);
                }
                
            } else {
                message.error("Failed Add Action!")
            }
        } else {
            message.error("Wait for Uploading...")
        }
        setBtnLoader(false);
    }
    // Update Request (Acknowledge or Cancel) -> from requester
    async function UpdateRequest(newData, id, withReply) {
        setBtnLoader(true);
        const data = newData;
        const response = await UpdateResearchRequest(data, id);
        if(response && withReply) {
            if(isFilesFinishUpload) {
                message.success(`Done!`);
                AddReply(actionNote, false);
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
            setLoading(false);
        } else {
            navigate(defualt_route + '/research-requests/new-request');
            message.info("Not Found Item")
        }
    }, []);


    // Replys Uploader Component
    const ReplyUploader = (
        <Upload 
            action="https://dev.salic.com/api/uploader/up"
            fileList={fileList}
            onChange={({ fileList: newFileList }) => setFileList(newFileList)}
        >
            <Button type='ghost' size='middle' icon={<UploadOutlined />}>Attach Files</Button>
        </Upload>
    )
    // Checkbox If Show Reply To Requester Component
    const CheckboxReply = () => <Checkbox onClick={() => setCheckboxReply(!checkboxReply)} value={checkboxReply}>Do you want the Requester to see this reply?</Checkbox>
    // Approve Modal Component
    const ApproveModal = () => (
        <Modal
            title='Write a note before Approve'
            open={openApproveModal}
            onCancel={() => setOpenApproveModal(false)}
            okButtonProps={{ style: {display: 'none'}}}
        >
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                <TextArea value={actionNote} onChange={e => setActionNote(e.target.value)} placeholder='write something' />
                {ReplyUploader}
                {!IfRequester && CheckboxReply()}
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
                {!IfRequester && CheckboxReply()}
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
                {!IfRequester && CheckboxReply()}
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
    const PendingAssignee = assigneeHistoryData?.filter(a => a.Status === "Pending" && a.ToUser.EMail === user_data.Data?.Mail)[0];
    // check if current user is requester or not
    const IfRequester = requestData?.Author?.EMail === user_data?.Data?.Mail;
    // filter replys by current user (if approval (return *) if requester (return replys by proparaty 'ShowToRequester'))
    const FilteredReplys = IfRequester ? replys.filter(r => r.ShowToRequester) : replys;

    // remove value from textbox when any modal open or close
    useEffect(() => {
        setActionNote("");
    }, [openCancelModal, openApproveModal, openRejectModal, openSubmitModal])



    return (
    <>
        <HistoryNavigation>
            <a onClick={() => navigate(`${defualt_route}/research-requests`)}>Research Requests</a>
            <p>Preview Request</p>
        </HistoryNavigation>
        


        <div className='preview-request-container'>
            <div className="header">
                <h1>Research Request: [#{requestData?.Id || '###'}]</h1>
                {
                    !IfRequester && requestData.Status === 'Submitted' && PendingAssignee?.Status === "Pending"
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
                    :   IfRequester && requestData.Status === 'Approved'
                    ?   <Button onClick={() => {UpdateRequest({Status: "Acknowledge"}, id, false); setRequestData(prev => {prev.Status="Acknowledge"; return prev})}} type="primary" disabled={btnLoader}>Acknowledge</Button>
                    :   IfRequester && requestData.Status === 'Submitted'
                    ?   <>
                            <Button onClick={() => setOpenCancelModal(true)} type="primary" disabled={btnLoader} danger>Cancel Request</Button>
                            {CancelModal()}
                        </>
                    :   null
                }
            </div>
        {
            !loading
            ?   (
                    assigneeHistoryData?.length > 0
                    ?   <div className='content'>
                            <div className='timeline'>
                                <Timeline>
                                    <div className="request-reply">
                                        <Timeline.Item dot={<SenderImg Email={requestData.Author.EMail} Name={requestData.Author.Title} />}>
                                            <Reply 
                                                Title={<>RE: {requestData?.Title}, <Typography.Text type="secondary" style={{fontSize: '0.8rem'}}>by {requestData.Author?.Title}</Typography.Text></>}
                                                Description={new Date(requestData?.Created).toLocaleString()} 
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
                                            <Timeline.Item dot={<SenderImg Email={user_data.Data.Mail} Name={user_data.Data.DisplayName} />}>
                                                <Row gutter={[10, 10]}>
                                                    <Col span={24}>                            
                                                        <TextArea rows={4} placeholder="Add Reply" maxLength={500} value={newReplyText} onChange={e => setNewReplyText(e.target.value)} />
                                                    </Col>
                                                    <Col span={24}>
                                                    {!(openApproveModal||openCancelModal||openRejectModal||openSubmitModal) && ReplyUploader}
                                                    </Col>
                                                    {!IfRequester && 
                                                    <Col span={24}>
                                                        {CheckboxReply()}
                                                    </Col>}
                                                    <Col span={24}>
                                                        <Button type='primary' onClick={() => AddReply(newReplyText, false)} disabled={btnLoader}>Add Feedback</Button>
                                                    </Col>
                                                </Row>
                                            </Timeline.Item>
                                        </div>
                                    }
                                </Timeline>
                            </div>

                            <div className='properties'>
                                <Section SectionTitle="Expected Response Date">
                                    <div>
                                        {new Date(requestData.Timeline).toLocaleDateString()}
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
                                            ? <span style={{fontStyle: 'italic', color: '#aaa', fontSize: '1rem', lineHeight: 1}}>No Attachments</span>
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
                                            assigneeHistoryData.map((row, i) => {
                                                return  <Steps.Step 
                                                            key={i}
                                                            title={<b><CaretRightOutlined />{row.ToUser?.Title}</b>} 
                                                            subTitle={<>at {new Date(row.Created).toLocaleString()}</>}
                                                            description={row.Action !== "Submit" ? (row.ActionDate ? <>{row.ToUser?.Title} <b>{row.Status}</b> this Request at {new Date(row.ActionDate).toLocaleString()}</> : "Request is now being Reviewed.") : null}
                                                        />
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
                            action={<Button size="small" type="primary" onClick={() => navigate(defualt_route+'/research-requests')}>Back</Button>}
                        />
                )
            :   <AntdLoader />
        }
        </div>
    </>
    )
}

export default PreviewResearchRequest