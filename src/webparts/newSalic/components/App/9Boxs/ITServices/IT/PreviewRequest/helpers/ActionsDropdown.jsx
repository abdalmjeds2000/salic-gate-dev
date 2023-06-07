import React, { useState, useContext } from 'react';
import { Button, Dropdown, Tooltip } from 'antd';
import { CheckOutlined, CloseOutlined, CloseSquareOutlined, DownOutlined, FileDoneOutlined, FileSyncOutlined, PullRequestOutlined, RetweetOutlined, SendOutlined } from '@ant-design/icons';
import { AppCtx } from '../../../../../App';
import { ApproveAction, RejectAction } from './Actions/ApproveAction';
import ReOpenAction from './Actions/ReOpenAction';
import DeleteAction from './Actions/DeleteAction';
import AssignAction from './Actions/AssignAction';
import CloseAction from './Actions/CloseAction';
import AskForApprovalAction from './Actions/AskForApprovalAction';
import ReAssignApprovalAction from './Actions/ReAssignApprovalAction';
import useIsAdmin from '../../../../../Hooks/useIsAdmin';


const initialmodalsStatuses = { reopen: false, cancel: false, assign: false, close: false, askapproval: false, reassign: false };
const ActionsDropdown = ({ requestData, GetRequest }) => {
  const { user_data } = useContext(AppCtx);
  const [modalsStatuses, setModalsStatuses] = useState(initialmodalsStatuses);
  const [isItAdmin] = useIsAdmin("IT_Admin");

  // Get Current Assignee for current user
  let pendingApprove = null;
  if(Object.keys(user_data).length > 0 && Object.keys(requestData).length > 0) {
    requestData?.referingHistory?.forEach(row => {
      if(requestData?.Status !== "CLOSED" && row?.Action == "APPROVE" && row?.Response == "PENDING" && row?.ToUser?.Mail?.toLowerCase() === user_data.Data?.Mail?.toLowerCase()) {
        pendingApprove = row;
      }
    })
  }

  var requester = requestData.Requester;
  var onbehalf = requestData.OnBehalfOf;
  if (onbehalf != null){ requester = onbehalf; }
  let IfRequester = requester?.Mail?.toLowerCase() === user_data.Data?.Mail?.toLowerCase();


  let disableAssignClose = false;
  if(!requestData?.Category || requestData?.Category === "" || requestData?.Category === "Other" || !requestData?.IssueType || requestData?.IssueType === "") {
    disableAssignClose = true;
  }
  let lastRefering = {};
  if(Object.keys(requestData).length > 0) {
    lastRefering = requestData?.referingHistory[requestData?.referingHistory?.length - 1];
  }


  const items = [
    (pendingApprove !== null ? {
      key: 'approve',
      isModal: false,
      label: (
        <ApproveAction ActionId={pendingApprove?.Id} handelAfterAction={GetRequest}>
          <sapn>Approve</sapn>
        </ApproveAction>
      ),
      icon: <CheckOutlined />,
    } : null),
    (pendingApprove !== null ? {
      key: 'reject',
      isModal: false,
      danger: true,
      label: (
        <RejectAction ActionId={pendingApprove?.Id} handelAfterAction={GetRequest}>
          <sapn>Reject</sapn>
        </RejectAction>
      ),
      icon: <CloseOutlined />,
    } : null),
    (user_data.Data?.Mail === 'abdulmohsen.alaiban@salic.com' ? {
      key: 'cancel',
      label: 'Cancel',
      danger: true,
      icon: <CloseSquareOutlined />,
    } : null),
    ((requestData.Status === "CLOSED" && IfRequester) ? {
      key: 'reopen',
      label: 'Re-Open',
      icon: <RetweetOutlined />,
    } : null),

    (isItAdmin && ((!["CLOSED", "Waiting For Approval"].includes(requestData?.Status)) || (requestData?.Status === "Waiting For Approval" && lastRefering?.Action === "APPROVE" && lastRefering?.Response === "APPROVED")) ? {
      key: 'assign',
      label: <Tooltip title={disableAssignClose ? 'Please Update Ticket Information' : null}>Assign</Tooltip>,
      disabled: disableAssignClose,
      icon: <SendOutlined />
    } : null),
    (isItAdmin && (!["CLOSED", "Waiting For Approval"].includes(requestData?.Status)) ? {
      key: 'close',
      label: <Tooltip title={disableAssignClose ? 'Please Update Ticket Information' : null}>Close</Tooltip>,
      disabled: disableAssignClose,
      icon: <FileDoneOutlined />,
      danger: true,
    } : null),
    (isItAdmin && (!["CLOSED"].includes(requestData?.Status)) ? {
      key: 'askapproval',
      label: 'Ask For Approval',
      icon: <PullRequestOutlined />,
    } : null),

    (isItAdmin && ["Waiting For Approval"].includes(requestData?.Status) ? {
      key: 'reassign',
      label: 'Re-Assign Approval',
      icon: <FileSyncOutlined />,
    } : null)
  ];
  
  
  const onClick = ({ key }) => {
    const newModalStatuses = { ...initialmodalsStatuses, [key]: true };
    setModalsStatuses(newModalStatuses);
  };


  const handleCloseModals = () => setModalsStatuses(initialmodalsStatuses);
  return (
    <div>
      <Dropdown trigger={['click']} menu={{ items, onClick }} placement="bottomRight" arrow={{ pointAtCenter: true }}>
        <Button>Actions <DownOutlined /></Button>
      </Dropdown>


      {isItAdmin && ((!["CLOSED", "Waiting For Approval"].includes(requestData?.Status)) || (requestData?.Status === "Waiting For Approval" && lastRefering?.Action === "APPROVE" && lastRefering?.Response === "APPROVED")) &&
        <AssignAction
          openModal={modalsStatuses.assign}
          onCancel={handleCloseModals}
          EmployeesList={requestData.EmployeeList} 
          RequestId={requestData.Id} 
          handelAfterAction={GetRequest} 
        />
      }
      {isItAdmin && (!["CLOSED", "Waiting For Approval"].includes(requestData?.Status)) &&
        <CloseAction
          openModal={modalsStatuses.close}
          onCancel={handleCloseModals}
          RequestId={requestData.Id} 
          handelAfterAction={GetRequest} 
        />
      }
      {user_data.Data?.Mail === 'abdulmohsen.alaiban@salic.com' ?
        <DeleteAction RequestId={requestData.Id} handelAfterAction={GetRequest} openModal={modalsStatuses.cancel} onCancel={handleCloseModals} /> : null}
      {(requestData.Status === "CLOSED" && IfRequester) ? 
        <ReOpenAction RequestId={requestData.Id} handelAfterAction={GetRequest} openModal={modalsStatuses.reopen} onCancel={handleCloseModals} /> : null}
      
      {isItAdmin && (!["CLOSED"].includes(requestData?.Status)) ? 
        <AskForApprovalAction RequestId={requestData.Id} handelAfterAction={GetRequest} openModal={modalsStatuses.askapproval} onCancel={handleCloseModals} /> : null}
      {isItAdmin && ["Waiting For Approval"].includes(requestData?.Status) ? 
        <ReAssignApprovalAction RequestId={requestData.Id} handelAfterAction={GetRequest} openModal={modalsStatuses.reassign} onCancel={handleCloseModals} /> : null}
    </div>
  )
}

export default ActionsDropdown