import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, DatePicker, Divider, Form, Input, InputNumber, message, Modal, notification, Radio, Select, Space, Upload } from 'antd';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { AppCtx } from '../../../../../../App';
import moment from 'moment';
import AddSelectItem from '../../../components/AddSelectItem';


const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });





const UpdateAssetForm = ({data, onSuccessUpdate}) => {
  const { user_data } = useContext(AppCtx);
  const [form] = Form.useForm();
  const [categoryType, setCategoryType] = useState("Hardware");
  const [lookupsData, setLookupsData] = useState([]);
  const [btnLoader, setBtnLoader] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState([]);
  const handleCancel = () => setPreviewVisible(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const [statusList, setStatusList] = useState(['New', 'Good']);



  var types = lookupsData?.filter(x=>x.Property === 'Type');
  var brands = lookupsData?.filter(x=>x.Property === 'Brand');
  var models = lookupsData?.filter(x=>x.Property === 'Model');
  var supplier = lookupsData?.filter(x=>x.Property === 'Supplier');
  const getLookups = async () => {
    const lookupsResponse = await axios.get('https://dev.salic.com/api/Asset/GetLookups');
    if(lookupsResponse.data?.Status === 200) {
      setLookupsData(lookupsResponse.data?.Data);
    }
  }


  useEffect(() => {
    getLookups();
  }, []);





  const SubmitForm = async (formData) => {
    setBtnLoader(true);

    // Get Files Nemes Uploaded & check if all files finish uploading
    let isFilesFinishUpload = true;
    const files = fileList.map((file) => {
      if (file.status === "uploading") isFilesFinishUpload = false;
      return file.response?.uploadedFiles[0]?.Name;
    });
    if(isFilesFinishUpload) {
      formData.Id = data.Id;
      formData.Email = user_data.Data?.Mail;
      formData.Files = files.join();
      formData.SubDevices = JSON.stringify(formData.SubDevices) || '[]';
      formData.ReceivedDate = moment(formData.ReceivedDate).format('MM/DD/YYYY')
      const requestResponse = await axios.post('https://dev.salic.com/api/Asset/Update', formData);
      if(requestResponse.status == 200) {
        notification.success({message: requestResponse?.data?.Message})
        setFileList([]);
        form.resetFields();
        onSuccessUpdate();
      } else {
        message.error('failed update asset')
      }
      console.log('requestResponse', requestResponse);
    } else {
      message.error("Wait For Uploading...")
    }
    
    setBtnLoader(false);
  }





  return (
    <div>
      <Form 
        colon={false}
        labelWrap 
        form={form}
        name="asset-register" 
        layout="vertical"
        onFinish={SubmitForm}
        onFinishFailed={() => message.error("Please, fill out the form correctly.")}
      >


        <Form.Item name="Name" label="Asset Name" initialValue={data.Name} rules={[{required: true,}]} >
          <Input placeholder='enter full name' />
        </Form.Item>
        <Form.Item name="AssetNumber" label="Asset Number" initialValue={data.AssetNumber} rules={[{required: true,}]} >
          <Input placeholder='full asset number' />
        </Form.Item>

        <Form.Item name="Status" label="Asset Status" initialValue={data.Status} rules={[{required: true}]}>
          <Select
            placeholder="Select Status"
            dropdownRender={menu => <AddSelectItem menu={menu} setItems={setStatusList} />}
            options={statusList?.map((item) => ({label: item, value: item }))}
          />
        </Form.Item>

        <Form.Item name="Location" label="Asset Location" initialValue={data.Location} rules={[{required: true}]} >
          <Input placeholder='write here' />
        </Form.Item>

        <Form.Item name="ReceivedDate" label="Receiving Date" initialValue={moment(new Date(data.ReceivedDate))} rules={[{required: true}]} >
          <DatePicker format='MM/DD/YYYY' placeholder='select the date you recieved the asset' style={{width: '100%'}} />
        </Form.Item>

        <Form.Item name="TagNumber" label="Tag Number" initialValue={data.TagNumber} rules={[{required: true}]}>
          <Input placeholder='auto generated' />
        </Form.Item>
        <Form.Item name="SN" label="S/N" initialValue={data.SN} rules={[{required: true}]} >
          <Input placeholder='(i.e. 0A4WHMCD700181R)' />
        </Form.Item>

        <Divider />

        <Form.Item name="CategoryType" label="Category" initialValue={data.CategoryType} rules={[{required: true}]} >
          <Radio.Group value={categoryType} onChange={({ target: { value } }) => {setCategoryType(value)}}>
            <Space direction="vertical">
              <Radio value="Hardware">
                <span>Hardware Devices</span>
              </Radio>
              <Radio value="Software">
                <span>Software Licenses</span>
              </Radio>
              <Radio value="Accessories">
                <span>Cables & Accessories</span>
              </Radio>
            </Space>
          </Radio.Group>
        </Form.Item>
        {categoryType === "Hardware" && <Form.Item name="Type" label="Type" initialValue={data.Type} rules={[{required: true,}]}>
          <Select
            showSearch
            placeholder="select device type"
            // onChange={value => console.log(value)}
            // onSearch={value => console.log(value)}
            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
          >
            <Select.Option value="Laptop">Laptop</Select.Option>
            <Select.Option value="Monitor">Monitor</Select.Option>
            <Select.Option value="Printer">Printer</Select.Option>
            <Select.Option value="Desktop">Desktop</Select.Option>
            <Select.Option value="Server">Server</Select.Option>
            {types?.map((row, i) => <Select.Option key={i} value={row.Value}>{row.Value}</Select.Option>)}
          </Select>
        </Form.Item>}
        
        <Form.Item name="Brand" label="Brand/Manufacture/Company" initialValue={data.Brand} rules={[{required: true}]}>
          <Select
            showSearch
            placeholder="select one value"
            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
          >
            {brands?.map((row, i) => <Select.Option key={i} value={row.Value}>{row.Value}</Select.Option>)}
          </Select>
        </Form.Item>
        <Form.Item name="Model" label="Model/Version" initialValue={data.Model} rules={[{required: true}]}>
          <Select
            showSearch
            placeholder="select device model"
            optionFilterProp="children"
            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
          >
            {models?.map((row, i) => <Select.Option key={i} value={row.Value}>{row.Value}</Select.Option>)}
          </Select>
        </Form.Item>
        <Form.Item name="Classification" initialValue={data.Classification} label="Classification" >
          <Select placeholder="employee name">
            <Select.Option value="Normal">Normal</Select.Option>
            <Select.Option value="Meduim">Meduim</Select.Option>
            <Select.Option value="High">High</Select.Option>
            <Select.Option value="Critical">Critical</Select.Option>
          </Select>
        </Form.Item>

        <Divider />

        <Form.Item name="Quantity" label="Quantity" initialValue={data.Quantity}>
          <InputNumber min={1} placeholder="default is 1" />
        </Form.Item>
        <Form.Item name="Cost" label="Cost" initialValue={data.Cost} rules={[{required: true}]}>
          <InputNumber min={1} placeholder="asset cost in SAR" />
        </Form.Item>
        <Form.Item name="PurchaseOrder" initialValue={data.PurchaseOrder} label="Purchase Order #">
          <Input placeholder='PO# (i.e. 800)' />
        </Form.Item>
        <Form.Item name="Warranty" label="Warranty/Expiration" initialValue={data.Warranty} rules={[{required: true}]}>
          <InputNumber placeholder="warranty in months" />
        </Form.Item>

        <Divider />

        <Form.Item name="Supplier" label="Supplier" initialValue={data.Supplier} rules={[{required: true}]}>
          <Select
            showSearch
            placeholder="select supplier name"
            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
          >
            {supplier?.map((row, i) => <Select.Option key={i} value={row.Value}>{row.Value}</Select.Option>)}
          </Select>
        </Form.Item>
        <Form.Item name="SupplierInfo" initialValue={data.SupplierInfo} label="Contact Info">
          <Input placeholder='supplier address / telephone' />
        </Form.Item>

        <Divider />

        <Form.Item label="Sub devices">
          <Form.List name="SubDevices" initialValue={JSON.parse(!data.SubDevices || data.SubDevices == "" ? "[]" : data.SubDevices)}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} align="baseline">
                    <Form.Item {...restField} name={[name, 'name']} rules={[{required: true, message: false}]}>
                      <Input placeholder="device name (e.g. HP charge 75W)" />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'tag']}>
                      <Input placeholder="tag number" />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'sn']}>
                      <Input placeholder="serial number" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add field
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form.Item>
        <Form.Item name="Description" initialValue={data.Description?.replace( /(<([^>]+)>)/ig, '')} label="Description">
          <Input.TextArea rows={6} placeholder="write a brief description" />
        </Form.Item>
        <Form.Item label="Attached Files">
          <Upload
            action="https://dev.salic.com/api/uploader/up"
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
          >
            {fileList.length >= 25 ? null : <div><PlusOutlined /><div style={{marginTop: 8}}>Upload</div></div>}
          </Upload>
          <Modal open={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
            <img alt="example" style={{width: '100%'}} src={previewImage} />
          </Modal>
        </Form.Item>

        <Button type="primary" htmlType='submit' loading={btnLoader}>
          Update
        </Button>
      </Form>
    </div>
  )
}

export default UpdateAssetForm