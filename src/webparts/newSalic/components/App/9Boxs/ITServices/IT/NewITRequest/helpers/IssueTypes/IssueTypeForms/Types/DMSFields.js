import React, { useContext, useEffect, useState } from "react";
import { Form, Select } from "antd";
import { AppCtx } from "../../../../../../../../App";
import axios from "axios";
import AntdLoader from "../../../../../../../../Global/AntdLoader/AntdLoader";

function DMSFields() {
  const { user_data, oracle_form_data, setOracleFormData } = useContext(AppCtx);
  const [loading, setLoading] = useState(false);


  let _dmsFolders = oracle_form_data.filter((r) => r.Process === "DMS");
  const _dmsFoldersList = new Set();
  var uniqueDescription = _dmsFolders.filter((m) => {if (_dmsFoldersList.has(m.Description)) {return false;} _dmsFoldersList.add(m.Description); return true;});


  const fetchData = async () => {
    setLoading(true);
    const response = await axios.get("https://dev.salic.com/api/Tracking/GetOracleFormData");
    if(response.status == 200) {
      setOracleFormData(response.data.Data)
    }
    setLoading(false);
  }
  useEffect(() => {
    if(Object.keys(user_data).length > 0 && oracle_form_data.length === 0) {
      fetchData();
    }
  }, [user_data])


  if(loading) {
    return <AntdLoader />
  }
  return (
    <div style={{transition: '0.5s'}}>
      <Form.Item name="PermissionType" label="Permission Type" rules={[{ required: true, message: '' }]}>
        <Select>
          <Select.Option value="Full Control">Full Control</Select.Option>
          <Select.Option value="Edit">Edit</Select.Option>
          <Select.Option value="Read Only">Read Only</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item name="MainFolder" label="Main Folder" rules={[{ required: true, message: false }]}>
        <Select placeholder="Select Folder">
          {uniqueDescription.map(d => <Select.Option value={d.Description}>{d.Description}</Select.Option>)}
        </Select>
      </Form.Item>
    </div>
  );
}

export default DMSFields;
