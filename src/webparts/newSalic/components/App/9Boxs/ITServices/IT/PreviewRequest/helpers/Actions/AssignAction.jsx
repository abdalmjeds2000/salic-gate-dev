import React, { useState, useContext } from 'react';
import { Button, message, Modal, Select, Typography } from 'antd';
import { AppCtx } from '../../../../../../App';
import { SendOutlined } from '@ant-design/icons';
import AssignSeriveRequest from '../../../../API/AssignSeriveRequest';


function AssignAction({ RequestId, EmployeesList, handelAfterAction, openModal, onCancel }) {
  const { user_data } = useContext(AppCtx);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [isShowing, setIsShowing] = useState(true);

  const assignAction = async () => {
    if(selectedEmp) {
      const payload = {
        Email: user_data.Data.Mail,
        ToUser: selectedEmp,
        ByUser: user_data.Data.Mail,
        ServiceRequestId: RequestId
      };
      await AssignSeriveRequest(payload);
      message.success("Service request has assigned");
      if(handelAfterAction) handelAfterAction();
      setIsShowing(false);
      setSelectedEmp(null);
    } else {
      message.error("Select Employee First!")
    }
  }

  return (
    <>
      {isShowing && 
        <Modal 
          title={<><SendOutlined /> Assign Service Request</>}
          open={openModal} 
          onCancel={onCancel}
          footer={[
            <Button type='primary' onClick={assignAction}>
              Assign
            </Button>,
            <Button onClick={onCancel}>
              Cancel
            </Button>,
          ]}
        >
          <Typography.Text strong>Select Employee</Typography.Text>
          <Select value={selectedEmp} size="large" placeholder="Select Employee" onChange={value => setSelectedEmp(value)} style={{width: '100%'}}>
            {
              EmployeesList?.map((emp, i) => {
                return <Select.Option value={emp.Mail} key={i}>{emp.DisplayName}</Select.Option>
              })
            }
          </Select>
        </Modal>
      }
    </>
  )
}

export default AssignAction