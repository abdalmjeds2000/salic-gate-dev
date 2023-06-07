import { DatePicker, Form, Radio, Select } from "antd";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AppCtx } from "../../../../../../../../App";
import AntdLoader from "../../../../../../../../Global/AntdLoader/AntdLoader";

function OracleFields() {
  const { user_data, oracle_form_data, setOracleFormData } = useContext(AppCtx);
  const [selectedModule, setSelectedModule] = useState("");
  const [loading, setLoading] = useState(false);


  let _data = oracle_form_data.filter((r) => r.Process === "Oracle");
  const moduels = new Set();
  var uniqueModuels = _data.filter((m) => {
    if (moduels.has(m.Module)) {
      return false;
    }
    moduels.add(m.Module);
    return true;
  });
  var rules = oracle_form_data.filter((r) => r.Module === selectedModule);


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
      <Form.Item name="Enviroment" label="Environment" initialValue="1" rules={[{ required: true, message: false }]}>
        <Radio.Group value="1">
          <Radio value="1">Production</Radio>
          <Radio value="2">Staging</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item name="NewAccount" label="New Account" initialValue="1" rules={[{ required: true, message: false }]}>
        <Radio.Group value="1">
          <Radio value="1">Yes</Radio>
          <Radio value="2">No</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item name="TemporaryAccess" label="Temporary Access" rules={[{ required: true, message: false }]}>
        <DatePicker.RangePicker format="MM/DD/YYYY" style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item name="Module" label="Module" rules={[{ required: true, message: false }]}>
        <Select
          value={selectedModule}
          onChange={(value) => setSelectedModule(value)}
          placeholder="Select the Module first"
        >
          {uniqueModuels.map((m) => (
            <Select.Option value={m.Module}>{m.Module}</Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="Rules" label="Roles" rules={[{ required: true, message: false }]}>
        <Select
          mode="tags"
          placeholder="Select the Module first"
          options={rules.map((rule) => {
            return { value: rule.Rule, label: rule.Rule };
          })}
        />
      </Form.Item>
    </div>
  );
}

export default OracleFields;
