import React, { useState } from 'react';
import { Button, message, Modal, Select, Typography } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import useIsAdmin from '../../../Hooks/useIsAdmin';
import AssignAdminRequest from './AssignAdminRequest';
import TextArea from 'antd/lib/input/TextArea';


function AssignAction({ RequestId, RequestType, onSuccess }) {
  const [openModal, setOpenModal] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isShowing, setIsShowing] = useState(true);
  const [commentVal, setCommentVal] = useState("");
  const [isAdmin, checkIsAdmin, admins, fetchAdmins] = useIsAdmin("Admin Users");

  const assignAction = async () => {
    setLoading(true);
    if(selectedEmp) {
      const payload = {
        Id: RequestId,
        ToUser: selectedEmp,
        Notes: commentVal
      };
      var form_data = new FormData();
      for(let key in payload) {
        form_data.append(key, payload[key]);
      }
      const response = await AssignAdminRequest(RequestType, form_data);
      console.log(response);
      if(response) {
        message.success("Admin Service Request has assigned");
        onSuccess();
        setIsShowing(false);
        setSelectedEmp(null);
        setCommentVal("");
        setOpenModal(false);
      } else {
        message.error("Failed Assign")
      }
    } else {
      message.error("Select Employee First!")
    }
    setLoading(false);
  }

  return (
    <>
      {isShowing && <>
        <Button type='primary' onClick={() => setOpenModal(true)}>Assign</Button>
        <Modal 
          title={<><SendOutlined /> Assign Admin Service Request</>}
          open={openModal} 
          onCancel={() => setOpenModal(false)}
          footer={[
            <Button type='primary' loading={loading} onClick={assignAction}>
              Assign
            </Button>,
            <Button onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
          ]}
        >
          <Typography.Text strong>Select Employee</Typography.Text>
          <Select value={selectedEmp} size="large" placeholder="Select Employee" onChange={value => setSelectedEmp(value)} style={{width: '100%'}}>
            {
              admins?.filter(user => !["stsadmin@salic.onmicrosoft.com", "akmal.eldahdouh@salic.com"].includes(user.Email?.toLowerCase()))?.map((emp, i) => {
                return <Select.Option key={i} value={emp.Email}>{emp.Title}</Select.Option>
              })
            }
          </Select>
          <br /><br />
          <Typography.Text strong>Leave a notes</Typography.Text>
          <TextArea rows={6} maxLength={10000} value={commentVal} placeholder="write a notes" onChange={(e) => setCommentVal(e.target.value)} />
        </Modal>
      </>}
    </>
  )
}

export default AssignAction