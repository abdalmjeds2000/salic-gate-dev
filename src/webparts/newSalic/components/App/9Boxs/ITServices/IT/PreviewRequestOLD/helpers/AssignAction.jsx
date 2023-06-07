import React, { useState, useContext } from 'react';
import { Button, message, Modal, Select, Tooltip, Typography } from 'antd';
import { AppCtx } from '../../../../../App';
import { SendOutlined } from '@ant-design/icons';
import AssignSeriveRequest from '../../../API/AssignSeriveRequest';


function AssignAction(props) {
  const { user_data } = useContext(AppCtx);
  const [openModal, setOpenModal] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);
  const [isShowing, setIsShowing] = useState(true);

  const assignAction = async () => {
    setBtnLoading(true);
    if(selectedEmp) {
      const payload = {
        Email: user_data.Data.Mail,
        ToUser: selectedEmp,
        ByUser: user_data.Data.Mail,
        ServiceRequestId: props.RequestId
      }
      const AssignRequest = await AssignSeriveRequest(payload);
      if(AssignRequest) {
        message.success("Service request has assigned");
        props.handelAfterAction();
        setIsShowing(false);
        setSelectedEmp(null);
        setOpenModal(false);
      } else {
        message.success("Failed Assign")
      }
    } else {
      message.error("Select Employee First!")
    }
    setBtnLoading(false);
  }

  return (
    <>
      {isShowing && <>
        <Tooltip title={props.disableMessage}>
          <Button size="middle" type='default' disabled={props.isDisable}  onClick={() => setOpenModal(true)}>Assign</Button>
        </Tooltip>
        <Modal 
          title={<><SendOutlined /> Assign Service Request</>}
          open={openModal} 
          onCancel={() => setOpenModal(false)}
          footer={[
            <Button type='primary' onClick={assignAction}>
              Assign
            </Button>,
            <Button onClick={() => setOpenModal(false)}>
              Cancel
            </Button>,
          ]}
        >
          <Typography.Text strong>Select Employee</Typography.Text>
          <Select value={selectedEmp} size="large" placeholder="Select Employee" onChange={value => setSelectedEmp(value)} style={{width: '100%'}}>
            {
              props.EmployeesList?.map((emp, i) => {
                return <Select.Option value={emp.Mail} key={i}>{emp.DisplayName}</Select.Option>
              })
            }
          </Select>
        </Modal>
      </>}
    </>
  )
}

export default AssignAction