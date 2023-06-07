import React, { useContext, useRef, useState } from 'react';
import { CaretRightOutlined } from '@ant-design/icons';
import { Avatar, Form, Image, message, Steps, Timeline, Typography } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { AppCtx } from '../../../../App';
import HistoryNavigation from '../../../../Global/HistoryNavigation/HistoryNavigation';
import Reply from '../../../../Global/RequestsComponents/Reply';
import SenderImg from '../../../../Global/RequestsComponents/SenderImg';
import GetITRequest from '../../API/GetITRequest';
import moment from 'moment';
import AddITReply from '../../API/AddITReply';
import Section from '../../../../Global/RequestsComponents/Section';
import FileIcon from '../../../../Global/RequestsComponents/FileIcon';
import UpdateRequestForm from './helpers/UpdateRequestForm';
import AntdLoader from '../../../../Global/AntdLoader/AntdLoader';
import ToggleButton from '../../../../Global/ToggleButton';
import { CgMoreO } from 'react-icons/cg';
import { GetFormDataOracle, GetFormDataSharedEmail, GetFormDataUSB, GetFormDataDMS, GetFormDataPhone, GetFormDataSoftwareLic, GetFormDataNewAccount, GetFormDataGLAccount, GetFormDataCreateGroupemail, GetFormDataAddUserstoAGroup, GetFormDataChangeLineManager, GetFormDataChangeJobTitle, GetFormDataMASAR, GetFormDataNewEmailAccount, GetFormDataInstallProgramTool } from './helpers/RequestTabels';
import ReplyForm from "./helpers/ReplyForm";
import ActionsDropdown from "./helpers/ActionsDropdown";


const { Text } = Typography;
function isEmpty(obj) {
  for(var prop in obj) {
      if(Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
      }
  }
  return JSON.stringify(obj) === JSON.stringify({});
}

const UserImage = ({ email }) => {
  const { sp_site } = useContext(AppCtx);
  return (
    <Avatar
      // size="small"
      src={
        <Image
          src={`${sp_site}/_layouts/15/userphoto.aspx?size=s&username=${email}`}
          preview={{src: `${sp_site}/_layouts/15/userphoto.aspx?size=L&username=${email}`,}}
        />
      }
      style={{marginRight: 8}}
    />
  )
}

function processTextWithLink(text) {
  if (!text) return '';

  const linkRegex = /(https?:\/\/\S+)/g;
  const matches = text.match(linkRegex);

  if (matches) {
    matches.forEach((match) => {
      const link = `<a href="${match}" target="_blank">${match}</a>`;
      text = text.replace(match, link);
    });
  }

  return text;
}





function PreviewITServiceRequest() {
  let { id } = useParams();
  const { user_data, defualt_route } = useContext(AppCtx);
  const navigate = useNavigate();
  const [btnLoader, setBtnLoader] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [requestData, setRequestData] = React.useState({});
  const [fileList, setFileList] = React.useState([]);
  const [replyForm] = Form.useForm();
  const [imageViewData, setImageViewData] = useState({ src: null, visible: false });

  // Get Content Request by {id} and display it on preview
  async function GetRequest() {
    setBtnLoader(true);
    const response = await GetITRequest(user_data.Data?.Mail, id);
    if(response.data.Status === 200) {
      const resData = response.data.Data;
      document.title = `.:: SALIC Gate | ${resData.Subject} ::.`;
      setRequestData(resData);
    } else {
      console.log("ERROR :: Get IT Service Request");
    }
    setBtnLoader(false);
  } 
  
  React.useEffect(() => {
    if(Object.keys(user_data).length > 0) {
      if(id) {
        setLoading(true);
        GetRequest()
        .then(() => setLoading(false))
        .then(() => console.log("NNNNOOOOOWWWWW"))
        .then(() => correctImgs())
      } else {
        navigate(defualt_route + '/services-requests/services-request');
        message.info("Error ::: Not Found Request")
      }
    }
  }, [user_data]);


  function extractMentions(text) {
    const regex = /@{display:\s*(.*?),\s*id:\s*([^}\s]+)}/g;
    let match;
    const listOfMentions = [];
    while ((match = regex.exec(text)) !== null) {
      listOfMentions.push({ display: match[1], id: match[2] });
    }
    return listOfMentions.map(m => m.id);
  }

  // Add New Reply
  async function AddReply(formValues) {
    // check if there files is uploading...
    let isFilesFinishUpload = true;
    const attachmentsList = fileList.map(file => {
      if(file.status === "uploading") isFilesFinishUpload = false
      return file.response?.uploadedFiles[0]?.Name
    });
    console.log(fileList);
    setBtnLoader(true);
    if(isFilesFinishUpload) {
      const replyJSON = {
        Email: user_data.Data.Mail,
        Files: attachmentsList.join(),
        PendingWithRequester: "0",
        ServiceRequestId: id,
        ListOfMentions: extractMentions(formValues.reply_body),
        ...formValues
      }
      const response = await AddITReply(replyJSON)
      if(response) {
        replyForm.resetFields();
        setFileList([]);
        GetRequest();
      } else {
        message.error("Failed Add Reply!")
      }
    }
    setBtnLoader(false);
  }

  var requester = requestData.Requester;
  var onbehalf = requestData.OnBehalfOf;
  if (onbehalf != null){ requester = onbehalf; }


  const correctImgs = () => {
    let imgs = document.getElementsByTagName("img");
    for (const element of imgs) {
      if(element.src.startsWith("cid")) {
        let name = element.src.split('@')[0].replace('cid:','');
        var deleteImg = document.querySelector('[data-originalName="'+name+'"]');
        let src = deleteImg?.getAttribute("data-guid");
        // delete parent of deleteImg
        deleteImg?.parentNode?.remove();
        // deleteImg.style?.display = "none";

        element.setAttribute('src', src);
        // on hover curser pointer
        element.style.cursor = "pointer";
        // scale image on hover
        element.style.transition = "transform 0.5s";
        element.onmouseover = function() {
          element.style.transform = "scale(1.03)";
        }
        element.onmouseout = function() {
          element.style.transform = "scale(1)";
        }
        // element on click to show image in Image Component
        element.onclick = function() {
          setImageViewData({ src: src, visible: true });
        }
      }
    }

    const x = document.getElementsByClassName("attachments-container")[0];
    let hideImages = 0;
    let imagesTotal = x.children.length;
    for (const element of x.children) {
      if(element.style.display == "none") {
        hideImages += 1;
      }
    }
    if(hideImages === imagesTotal) {
      x.innerHTML = "No attachments for this ticket"
    }
    // console.log("hideImages", hideImages, "imagesTotal", imagesTotal, "x", x);
  }


  // Toggle Properties Section (show and hide in mobile size)
  const propertiesSectionRef = useRef();
  const handleShowDetails = (v) => {
    propertiesSectionRef.current.style.display = 
    propertiesSectionRef.current.style.display === "block" ? "none" : "block";
  }

  function textComponent(text) {
    const replacedText = text.replace(/@{display: (.*?), id: (.*?)}/g, '<a target="_blank" href="https://devsalic.sharepoint.com/_layouts/15/me.aspx/?p=$2&v=work">@$1</a>');
    return <div dangerouslySetInnerHTML={{ __html: replacedText }} />;
  }

  return (
    <>
      <HistoryNavigation>
        <a onClick={() => navigate(`${defualt_route}/services-requests`)}>IT Service Center</a>
        <a onClick={() => navigate(`${defualt_route}/services-requests/service-requests-dashboard#2`)}>Service Requests Dashboard</a>
        <p>Preview IT Service Request</p>
      </HistoryNavigation>
      
      <div className='preview-request-container'>
        <div className="header">
          <h1>IT Service Request: [#{requestData?.Id || '###'}]</h1>
          {Object.keys(requestData).length > 0 && <div>
            <ActionsDropdown requestData={requestData} GetRequest={GetRequest} />
            <span className='properties-toggle-btn'>
              <ToggleButton 
                icon={<CgMoreO />}
                title="more information"
                callback={handleShowDetails}
              />
            </span>
          </div>}
        </div>

        <div className='content'>
          {
            !loading
            ? (
              <>
                <div className='timeline'>
                  <Timeline>
                    <div className="request-reply">
                      <Timeline.Item dot={<SenderImg Email={requester?.Mail} Name={requester?.DisplayName} />}>
                        <Reply
                          Title={<>RE: {requestData?.Subject}</>}
                          Description={<>{requestData?.Requester?.DisplayName} (Ext: {requestData.Requester?.Ext}) {requestData.OnBehalfOf && <><Typography.Text type="danger" strong>on behalf of</Typography.Text> {requestData?.OnBehalfOf?.DisplayName}</>} @ {moment(requestData?.CreatedAt).format('MM/DD/YYYY hh:mm:ss')}</>} 
                        >
                          <div className='it-request-access-table'>
                            {
                              requestData.FormData != null && !isEmpty(requestData.FormData)
                              ? (
                                requestData.IssueType === "Oracle"
                                  ? <GetFormDataOracle request={requestData} />
                                : requestData.IssueType === "Unlock USB"
                                  ? <GetFormDataUSB request={requestData} />
                                : requestData.IssueType === "DMS"
                                  ? <GetFormDataDMS request={requestData} />
                                : requestData.IssueType === "Phone Extensions"
                                  ? <GetFormDataPhone request={requestData} />
                                : requestData.IssueType === "New Account"
                                  ? <GetFormDataNewAccount request={requestData} />
                                : requestData.IssueType === "GL Account"
                                  ? <GetFormDataGLAccount request={requestData} />
                                : requestData.IssueType === "Shared Email"
                                  ? <GetFormDataSharedEmail request={requestData} />
                                : requestData.IssueType === "Software Subscription & Licenses"
                                  ? <GetFormDataSoftwareLic request={requestData} />
                                : requestData.IssueType === "Create Group email"
                                  ? <GetFormDataCreateGroupemail request={requestData} />
                                : requestData.IssueType === "Add Users to A Group"
                                  ? <GetFormDataAddUserstoAGroup request={requestData} />
                                : requestData.IssueType === "Change Line Manager"
                                  ? <GetFormDataChangeLineManager request={requestData} />
                                : requestData.IssueType === "Change Job Title"
                                  ? <GetFormDataChangeJobTitle request={requestData} />
                                : requestData.IssueType === "MASAR"
                                  ? <GetFormDataMASAR request={requestData} />
                                : requestData.IssueType === "NewEmailAccount"
                                  ? <GetFormDataNewEmailAccount request={requestData} />
                                : requestData.IssueType === "InstallProgramTool"
                                  ? <GetFormDataInstallProgramTool request={requestData} />
                                  : null
                              ) : (
                                null
                              )
                            }
                          </div>
                          <div style={{marginTop: 10, fontSize: '1rem'}} dangerouslySetInnerHTML={{__html: requestData?.Description}}></div>
                        </Reply>
                      </Timeline.Item>
                    </div>
                    {
                      requestData.Conversation?.map((reply, i) => {
                        let files = JSON.parse(reply.Body).Attachment;
                        let Attachments = [];
                        if(typeof files != 'undefined' && Object.keys(files).length != 0) {
                          files?.forEach(file => {
                            Attachments.push({
                              fileType: file.File.split(".")[file.File.split(".").length-1],
                              fileName: file.OriginalFile,
                              path: `https://dev.salic.com/File/${file.File}`
                            })
                          })
                        }

                        const text = JSON.parse(reply.Body).Body;
                        const processedText = processTextWithLink(text);
                        return (
                          <div className={(reply.CreatedBy?.Mail === user_data.Data?.Mail) ? "my-reply" : ""}>
                            <Timeline.Item key={i} dot={<SenderImg Email={reply.CreatedBy?.Mail} Name={reply.CreatedBy?.DisplayName} />}>
                              <Reply 
                                Title={reply.CreatedBy?.DisplayName} 
                                Description={`(Ext: ${reply.CreatedBy?.Ext}) ${new Date(reply.CreatedAt).toLocaleString()}`}
                                Files={Attachments}
                              >
                                {textComponent(processedText)}
                                {/* <div dangerouslySetInnerHTML={{__html: processedText}}></div> */}
                              </Reply>
                            </Timeline.Item>
                          </div>
                        )
                      })
                    }
                    {
                      requestData.Status === "CLOSED" && requestData.CloseReason && 
                      <div className="close-reply">
                        <Timeline.Item dot={<SenderImg Email={requestData.ClosedBy?.Mail} Name={requestData.ClosedBy?.DisplayName} />}>
                          <Reply
                            Title={requestData.ClosedBy?.DisplayName}
                            Description={`(Ext: ${requestData?.ClosedBy?.Ext}) ${moment(requestData?.UpdatedAt || requestData?.CreatedAt).format('MM/DD/YYYY hh:mm:ss')}`} 
                            Files={
                              (typeof JSON.parse(requestData.CloseReason).Attachment != 'undefined' && Object.keys(JSON.parse(requestData.CloseReason).Attachment).length != 0)
                              ? JSON.parse(requestData.CloseReason).Attachment.map(file => ({
                                  fileType: file.File.split(".")[file.File.split(".").length-1],
                                  fileName: file.OriginalFile,
                                  path: `https://dev.salic.com/File/${file.File}`
                                }))
                              : []
                            }
                          >
                            {JSON.parse(requestData.CloseReason)?.Body}
                          </Reply>
                        </Timeline.Item>
                      </div>
                    }
                    {
                      requestData?.Status != "CLOSED" &&
                      <div className="add-reply">
                        <Timeline.Item dot={<SenderImg Email={user_data.Data?.Mail} Name={user_data.Data?.DisplayName} />}>
                          <ReplyForm
                            fileList={fileList}
                            setFileList={setFileList}
                            replyForm={replyForm}
                            btnLoader={btnLoader}
                            onFinish={AddReply}
                          />
                        </Timeline.Item>
                      </div>
                    }
                  </Timeline>
                </div>

                <div className='properties' ref={propertiesSectionRef}>
                  <UpdateRequestForm RequestData={requestData} handleAfterUpdate={GetRequest} />
                  <Section SectionTitle="Attached Files">
                    <div className='attachments-container'>
                      {requestData.Files.map((file,i) => (
                        <a target='_blank' href={`https://dev.salic.com/File/${file.Guid}`} style={{ display: 'flex', alignItems: 'center', gap: 2, padding: 5 }}>
                          <FileIcon
                            key={i} 
                            FileType={file.FileName.split(".")[file.FileName.split(".").length-1]}
                            FileName={file.FileName}
                            FilePath={`https://dev.salic.com/File/${file.Guid}`}
                            IconWidth='22px'
                          />
                          <span style={{ color: '#555'}}>{file.FileName}</span>
                        </a>
                        )
                      )}
                      {
                        requestData.Files.length === 0
                        ? <Typography.Text>No attachments for this ticket</Typography.Text>
                        : null
                      }
                    </div>
                  </Section>
                  <Section SectionTitle="Assignee History">
                    <Steps 
                      direction="vertical"
                      size="small" 
                      status="process" 
                      current={requestData.Status == "CLOSED" ? requestData?.referingHistory.length+2 : requestData?.referingHistory.length}
                    >
                      <Steps.Step 
                        title={<><UserImage email={requestData?.Requester?.Mail} /> Submitted by <b>{requestData?.Requester?.DisplayName}</b></>} 
                        subTitle={`at ${new Date(requestData.CreatedAt).toLocaleString()}`} 
                        style={{paddingBottom: 15}}
                      />
                      {requestData?.referingHistory?.map((assignee, i) => {
                        let ruleName = '';
                        let waitApproveMsg = <></>;
                        if (assignee.Rule && assignee.Rule !== ''){
                          assignee.Rule = assignee.Rule.replaceAll('\r\n', '');
                          ruleName = ` As ${JSON.parse(assignee.Rule).Name} `;
                        }
                        if (assignee?.Action === "APPROVE" && assignee?.Response === "PENDING"){
                          waitApproveMsg = <Typography.Text type='warning' strong>Waiting Approval</Typography.Text>;
                        }
                        return (
                          <Steps.Step 
                            key={i}
                            title={
                              <b>
                                <UserImage email={assignee.ToUser?.Mail} />
                                {assignee.ByUser?.DisplayName} 
                                <CaretRightOutlined />  
                                {assignee.ToUser?.DisplayName} 
                                {ruleName}
                                {waitApproveMsg}
                              </b>
                            } 
                            subTitle={<>at {new Date(assignee.CreatedAt).toLocaleString()}</>}
                            description={ 
                              assignee.Response === "APPROVED" 
                              ? <><Text strong type='success'>{assignee.Response}</Text> at {new Date(assignee.UpdatedAt).toLocaleString()}</> 
                              : assignee.Response === "REJECTED" 
                              ? <><Text strong type='danger'>{assignee.Response}</Text> at {new Date(assignee.UpdatedAt).toLocaleString()}</> 
                              : null
                            }
                            style={{paddingBottom: 15}}
                          />
                        )
                      })}
                      {requestData?.Status === "CLOSED" ? (
                        <Steps.Step 
                          title={<><UserImage email={requestData?.ClosedBy?.Mail} /> Closed By <b>{requestData?.ClosedBy?.DisplayName}</b></>} 
                          subTitle={`at ${new Date(requestData?.UpdatedAt).toLocaleString()}`} 
                          style={{paddingBottom: 15}}
                        /> ) : null}
                    </Steps>
                  </Section>
                </div>
              </>
            )
            : <AntdLoader />
          }
        </div>
      </div>

      {/* Image Component for preview ticket images on click */}
      <Image
        width={200}
        style={{ display: 'none' }}
        src={imageViewData.src}
        preview={{
          visible: imageViewData.visible,
          scaleStep: 0.5,
          src: imageViewData.src,
          onVisibleChange: (value) => setImageViewData({ ...imageViewData, visible: value }),
        }}
      />
    </>
    
  )
}

export default PreviewITServiceRequest;