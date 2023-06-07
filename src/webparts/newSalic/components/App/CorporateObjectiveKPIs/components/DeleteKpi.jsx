import React, { useState } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, message, Popconfirm, Tooltip } from 'antd';
import DeleteKpiItem from '../API/DeleteKpiItem';

function DeleteKpi({ KpiId, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const handleDeleteKPI = async () => {
    setLoading(true);
    const response = await DeleteKpiItem(KpiId);
    if(response) {
      message.success("KPI has been Deleted!");
      onSuccess();
    }
    setLoading(false);
  }


  return (
    <>
      <Tooltip placement="left" title="Click to Delete KPI">
        <Popconfirm
          placement="topRight"
          title="Confirm Delete KPI ?"
          onConfirm={handleDeleteKPI}
          okText="Delete"
          okButtonProps={{ danger: true, loading }}
          cancelText="Cancel"
        >
          <Button type='link' danger><DeleteOutlined style={{ width: "100%", fontSize: "1rem" }} /></Button>
        </Popconfirm>
      </Tooltip>
    </>
  )
}

export default DeleteKpi