import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Form, Input, message, notification, Select, Table } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import HistoryNavigation from '../../../Global/HistoryNavigation/HistoryNavigation';
import FormPage from '../../components/FormPageTemplate/FormPage';
import SubmitCancel from '../../components/SubmitCancel/SubmitCancel';
import { AppCtx } from '../../../App';
import moment from 'moment';
import OfficeRequest from './API/OfficeRequest';
import GetOfficeSupplyRequestById from './API/GetOfficeSupplyRequestById'
import ActionsTable from '../../components/ActionsTable/ActionsTable';
import MarkAsDoneAction from '../AddAction/MarkAsDoneAction';
import pnp from 'sp-pnp-js';
import AntdLoader from '../../../Global/AntdLoader/AntdLoader';
import useIsAdmin from '../../../Hooks/useIsAdmin';
import AssignAction from '../AddAction/AssignAction';
import HoldAction from '../AddAction/HoldAction';


const { Option } = Select;
const layout = { labelCol: { span: 6 }, wrapperCol: { span: 12 } };





function OfficeSupply() {
  const { user_data, defualt_route } = useContext(AppCtx);
  let navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const { id } = useParams();
  const [requestData, setRequestData] = useState({});
  const [isAdmin] = useIsAdmin("Office Supply Admins");
  const [isAdminUser] = useIsAdmin("Admin Users");


  async function CreateOfficeSupplyRequest(values) {
    setBtnLoading(true);

    if(values.Items) {
      values.Items = JSON.stringify(values.Items);
    } else {
      values.Items = "[]";
    }
    const form_values = {
      CreatedBy: user_data?.Data?.Mail,
      ReferenceCode: "auto generated",
      Files: "",
      Id: 0,
      ...values
    }
    var form_data = new FormData();
    for ( var key in form_values ) {
      form_data.append(key, form_values[key]);
    }
    const response = await OfficeRequest(form_data);
    if(response?.status == 200) {
      form.resetFields();
      notification.success({message: response?.data?.Message || "Your Application has been submitted successfully."})
      if(response?.data?.Data) {
        navigate(defualt_route + "/admin-services/my-requests");
        window.open(defualt_route + '/admin-services/office-supply/' + response?.data?.Data);
      }
    } else {
      message.error("Failed to send request.")
    }

    setBtnLoading(false);
  }

  async function GetOfficeSupplyRequestData() {
    setLoading(true);
    const response = await GetOfficeSupplyRequestById(user_data.Data.Mail, id);
    if(response.data.Status === 200 && response.data.Data.length > 0) {
      document.title = `.:: SALIC Gate | ${response.data.Data[0].ReferenceCode || "Office Supply Request"} ::.`
      setRequestData(response.data.Data[0])
    } else {
      message.error("Error Get Request Data")
    }
    setLoading(false);
  }

  useEffect(() => {
    if(id) {
      if(Object.keys(user_data).length > 0 && Object.keys(requestData).length === 0) {
        GetOfficeSupplyRequestData();
      }
    } else {
      setLoading(false);
    }
  }, [user_data])


  /* Fetch Items from sp list */
  const [items, setItems] = useState([]);
  const fetchItems = async () => {
    const data = await pnp.sp.web.lists.getByTitle('Office Supply Items').items.get();
    setItems(data);
  }
  useEffect(() => {
    if(!id) { fetchItems(); }
  }, []);



  let isAllowActions;
  requestData?.Status?.forEach(item => {
    if(item.Type === "ACTION" && item.StatusLabel === "Pending" && item?.ToUser?.Mail?.toLowerCase() === user_data?.Data?.Mail.toLowerCase()) {
      isAllowActions = true;
    }
  });
  let lastStatus = requestData?.Status?.length > 0 ? requestData?.Status[requestData?.Status?.length - 1] : {};


  return (
    <>
      <HistoryNavigation>
        <a onClick={() => navigate(`${defualt_route}/admin-services`)}>Admin Service</a>
        <p>Office Supply</p>
      </HistoryNavigation>
      

      {
        !loading
        ? <FormPage
            pageTitle={!id ? 'New Office Supply Request' : requestData.ReferenceCode}
            Header={
              id && lastStatus.Type !== "FIN" && isAdminUser
              ? <>
                  {isAdmin && <AssignAction
                    RequestId={requestData.Id}
                    RequestType="Office"
                    onSuccess={GetOfficeSupplyRequestData} />}
                  {isAllowActions ? <HoldAction
                    RequestId={requestData.Id}
                    RequestType="Office"
                    onSuccess={GetOfficeSupplyRequestData} /> : null}
                  {isAllowActions ? <MarkAsDoneAction 
                    RequestType="Office" 
                    ModalTitle={`.:: ${requestData.ReferenceCode} ::.`} 
                    idName="Id" idVal={requestData.Id} 
                    onSuccess={GetOfficeSupplyRequestData} /> : null} 
                </>
              : null
            }
            Email={id ? requestData?.ByUser?.Mail : user_data?.Data?.Mail}
            UserName={id ? requestData?.ByUser?.DisplayName : user_data?.Data?.DisplayName}
            UserTitle={id ? requestData?.ByUser?.Title : user_data?.Data?.Title}
            UserDept={id ? requestData?.ByUser?.Department : user_data?.Data?.Department}
            UserNationality={id ? requestData?.ByUser?.Nationality : user_data.Data?.Nationality || ' - '}
            UserId={id ? requestData.ByUser?.Iqama || ' - ' : user_data?.Data?.Iqama || ' - '}
            EmployeeId={id ? parseInt(requestData.ByUser?.PIN, 10) || ' - ' : parseInt(user_data.Data?.PIN, 10) || ' - '}
            Extension={id ? requestData.ByUser?.Ext || ' - ' : user_data.Data?.Ext || ' - '}    
            tipsList={[
              "Fill out required fields carefully.",
              "Check your email regularly. You will receive a notification on every future actions",
            ]}
          >
            <Form 
              {...layout} 
              colon={false}
              name="Office Supply" 
              layout="horizontal"
              form={form} 
              onFinish={CreateOfficeSupplyRequest}
              onFinishFailed={() => message.error("Please, fill out the form correctly.")}
            >

              <Form.Item name="Date" label="Date" rules={[{required: true,}]} initialValue={moment(id ? new Date(requestData.CreatedAt) : new Date()).format('MM/DD/YYYY hh:mm')} >
                <Input placeholder='Date' size='large' disabled />
              </Form.Item>
              
              <hr />

              <Form.Item name="Requester" label="Requester" initialValue={id ? requestData.ByUser?.DisplayName : ''}>
                <Input placeholder='' size='large' disabled={id ? true : false}/>
              </Form.Item>

              {
                !id
                ? (
                  items.length > 0 &&
                  <Form.Item label="Items" required>
                    <Form.List
                      name="Items"
                      rules={[{
                          validator: async (_, items) => {
                            if (!items || items.length < 1) {
                              return Promise.reject();
                            }},
                          }]}
                    >
                      {(fields, { add, remove }, { errors }) => (
                        <>
                          {fields?.map((field, index) => (
                            <div key={field.key} style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px'}}>
                              <Form.Item name={[field.name, 'Key']} style={{width: '70%', margin: 0}} rules={[{required: true}]}>
                                <Select
                                  placeholder="select one value"
                                  size="large"
                                >
                                  {items?.map(item => <Option key={item.Id} value={item.Title}>{item.Title}</Option>)}
                                </Select>
                              </Form.Item>
                              <Form.Item name={[field.name, 'Value']} style={{width: '30%', margin: 0}} rules={[{required: true}]}>
                                <Input placeholder='Quantity' size='large' />
                              </Form.Item>
                              {fields.length > 1 ? (<MinusCircleOutlined style={{color: 'var(--brand-red-color)'}} className="dynamic-delete-button" onClick={() => remove(field.name)} />) : null}
                            </div>
                          ))}
                            <Button
                              type="dashed"
                              onClick={() => add()}
                              style={{width: '100%',}}
                              icon={<PlusOutlined />}
                            >
                              Add More
                            </Button>
                            <Form.ErrorList errors={errors} />
                        </>
                      )}
                    </Form.List>
                  </Form.Item>
                )
                : <Form.Item label="Items" required>
                    <Table
                      size='small'
                      columns={[{title: '#', dataIndex: 'Id', width: '10%'}, {title: 'Item', dataIndex: 'Key', width: '70%'}, {title: 'Quantity', dataIndex: 'Value', width: '20%'}]}
                      pagination={false}
                      dataSource={JSON.parse(requestData.Items == "" || requestData.Items == "undefined" || !requestData.Items ? "[]" : requestData.Items).map((item, i) => {
                        item.Id = i+1;
                        return {...item}
                      })}
                    />
                  </Form.Item>
              }
              
              {!id && <SubmitCancel loaderState={btnLoading} isUpdate={id ? true : false} backTo="/admin-services" />}
            </Form>
            {
              id && 
              <div className='admin-services-table'>
                <ActionsTable ActionData={requestData.Status || []} />
              </div>
            }
          </FormPage>
        : <AntdLoader />
      }
    </>
  )
}

export default OfficeSupply