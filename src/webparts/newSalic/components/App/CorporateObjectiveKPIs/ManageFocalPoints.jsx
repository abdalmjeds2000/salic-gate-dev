import React, { useContext, useEffect, useState } from 'react';
import Tabs from '../Global/CustomTabs/Tabs';
import HistoryNavigation from '../Global/HistoryNavigation/HistoryNavigation';
import { EditOutlined, TableOutlined } from '@ant-design/icons';
import { Web } from 'sp-pnp-js';
import { Button, Form, Row, Select, message } from 'antd';
import DropdownSelectUser from '../Global/DropdownSelectUser/DropdownSelectUser';
import { AppCtx } from '../App';
import { useNavigate } from 'react-router-dom';


const ManageFocalPoints = () => {
  const { defualt_route } = useContext(AppCtx);
  const navigate = useNavigate();

  return (
    <>
      <HistoryNavigation>
        <a onClick={() => navigate(defualt_route + '/hc-services')}>Human Capital Services</a>
        <a onClick={() => navigate(defualt_route + '/corporate-objective')}>Corporate Objective KPIs</a>
        {/* <a onClick={() => navigate(defualt_route + '/manage-corporate-objective')}>Manage KPIs</a> */}
        <p>Manage Focal Points</p>
      </HistoryNavigation>

      <div className='folder-explorer-container'>  
        <iframe
          name='KPIs_Focal_Points_IFrame'
          src="https://devsalic.sharepoint.com/sites/MDM/Lists/KPIs%20Focal%20Points/AllItems.aspx"
          width="100%"
          style={{ border: 0, minHeight: "calc(100vh - 100px)" }}
        />
      </div>
    </>
  )
}

export default ManageFocalPoints;



const EditFocalPoint = () => {
  const [form] = Form.useForm();
  const [focalPoints, setFocalPoints] = useState([]);
  const [selectedSector, setSelectedSector] = useState({});
  const [selectedUserMail, setSelectedUserMail] = useState('');
  const [loading, setLoading] = useState(false);
  const { user_data, salic_departments } = useContext(AppCtx);
  const web = new Web('https://devsalic.sharepoint.com/sites/MDM');
  
  async function getData() {
    const res_focalPoints = await web.lists.getByTitle("KPIs Focal Points").items.get();
    setFocalPoints(res_focalPoints);
  }
  console.log('selectedSector', selectedSector);

  useEffect(() => {
    if(Object.keys(user_data).length > 0) {
      getData();
    }
  }, [user_data]);

  useEffect(() => {
    if(selectedSector && Object.keys(selectedSector).length > 0) {
      form.setFieldsValue({ UserMail: selectedSector.UserMail });
    } else {
      form.setFieldsValue({ UserMail: null });
    }
  }, [selectedSector]);



  const handleFocalPointSaveSector = async (sector_name, user_mail) => {
    const isExist = await web.lists.getByTitle("KPIs Focal Points").items.filter(`Sector eq '${sector_name}'`).get();
    if(isExist.length > 0) {
      await web.lists.getByTitle("KPIs Focal Points").items.getById(isExist[0].Id).update({ UserMail: user_mail });
    } else {
      const payload = { Sector: sector_name, UserMail: user_mail };
      await web.lists.getByTitle("KPIs Focal Points").items.add(payload);
    }
  }

  const handleSubmit = async (form_data) => {
    setLoading(true);
    await handleFocalPointSaveSector(form_data.Sector, form_data.UserMail);
    message.success('Sector User updated successfully');
    form.resetFields();
    setSelectedSector({});
    setSelectedUserMail('');
    getData();
    setLoading(false);
  }


  return (
    <div>
      <Form form={form} layout='vertical' onFinish={handleSubmit} onFinishFailed={() => message.error("Please, fill all required fields")}>
        <Form.Item name='Sector' label="Sector Name" initialValue={null}>
          <Select size="large" placeholder="Select Sector" clearIcon onChange={v => setSelectedSector(focalPoints.filter(f => f.Sector === v)[0] || {})}>
            {salic_departments?.map((item, i) => <Select.Option key={i} value={item}>{item}</Select.Option>)}
          </Select>
        </Form.Item>

        <Form.Item label="Admin User" required>
          <DropdownSelectUser 
            name="UserMail" 
            placeholder="Select user" 
            value={selectedUserMail}
            onChange={v => setSelectedUserMail(v)}
            isDisabled={!selectedSector} 
            required 
          />
        </Form.Item>

        <Row justify='end'>
          <Button type='primary' size='large' htmlType='submit' loading={loading}>Update Sector User</Button>
        </Row>
      </Form>
    </div>
  )
}