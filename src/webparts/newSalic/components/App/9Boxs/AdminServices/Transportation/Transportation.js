import React, { useContext, useEffect, useState } from 'react';
import { Form, Input, Radio, DatePicker, message, notification } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom'
import moment from 'moment';
import HistoryNavigation from '../../../Global/HistoryNavigation/HistoryNavigation';
import FormPage from '../../components/FormPageTemplate/FormPage';
import SubmitCancel from '../../components/SubmitCancel/SubmitCancel';
import EditableTable from '../../components/EditableTable/EditableTableTransportation';
import { AppCtx } from '../../../App';
import TransportationRequest from './API/TransportationRequest';
import GetTransportationRequest from './API/GetTransportationRequest';
import ActionsTable from '../../components/ActionsTable/ActionsTable';
import MarkAsDoneAction from '../AddAction/MarkAsDoneAction';
import AntdLoader from '../../../Global/AntdLoader/AntdLoader';
import useIsAdmin from '../../../Hooks/useIsAdmin';
import AssignAction from '../AddAction/AssignAction';
import HoldAction from '../AddAction/HoldAction';

const { Search } = Input;
const layout = { labelCol: { span: 6 }, wrapperCol: { span: 12 } };




function Transportation() {
  const { id } = useParams();
  const { user_data, defualt_route } = useContext(AppCtx);
  let navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  
  const [passenger, setPassenger] = useState([{ key: 0, Name: '', Phone: '', Reason: '' }]);
  const [requestData, setRequestData] = useState({});
  const [serivceType, setSerivceType] = useState(id ? requestData.ToLink : 'OneWay');
  const [isAdmin] = useIsAdmin("Transportation Admins");
  const [isAdminUser] = useIsAdmin("Admin Users");


  async function CreateTransportationRequest(values) {
    setBtnLoading(true);

    let validation = true;
    for(let key in passenger) {
      if(passenger[key].Name === "" || passenger[key].Phone === "" || passenger[key].Reason === "") validation = false
    }

    if(validation) {
      values.Date = moment(values.Date).format('MM/DD/YYYY hh:mm');
      // reset editable table
      const passengers = passenger.map(p => {
        delete p.key
        return {...p}
      })
      // request payload
      const form_values = {
        Email: user_data?.Data?.Mail,
        ReferenceCode: "auto generated",
        Files: "",
        Id: "0",
        Passenger: JSON.stringify(passengers),
        ...values,
      }
      var form_data = new FormData();
      for ( var key in form_values ) {
        form_data.append(key, form_values[key]);
      }
      const response = await TransportationRequest(form_data);
      if(response?.status == 200) {
        form.resetFields();
        setSerivceType("OneWay")
        setPassenger([{ key: 0, Name: '', Phone: '', Reason: '' }]);
        notification.success({message: response?.data?.Message || "Your Application has been submitted successfully."})
        if(response?.data?.Data) {
          navigate(defualt_route + "/admin-services/my-requests");
          window.open(defualt_route + '/admin-services/transportation/' + response?.data?.Data);
        }
      } else {
        message.error("Failed to send request.")
      }
    } else {
      message.error("Passenger Informations is required")
    }
    setBtnLoading(false);
  }

  async function GetTransportationRequestData() {
    setLoading(true);
    const response = await GetTransportationRequest(user_data.Data.Mail, id);
    if(response.data.Status === 200 && response.data.Data.length > 0) {
      document.title = `.:: SALIC Gate | ${response.data.Data[0].ReferenceCode || "Transportation Request"} ::.`
      setRequestData(response.data.Data[0]);
      setPassenger(JSON.parse(response.data.Data[0].Passengers));
    } else {
      message.error("Error Get Request Data")
    }
    setLoading(false);
  }

  useEffect(() => {
    if(id) {
      if(Object.keys(user_data).length > 0 && Object.keys(requestData).length === 0) {
        GetTransportationRequestData();
      }
    } else {
      setLoading(false);
    }
  }, [user_data]);



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
        <p>{!id && 'New '}Transportation Request</p>
      </HistoryNavigation>
      
      {
        !loading
        ? (
            <FormPage
              pageTitle={!id ? 'New Transportation Request' : requestData.ReferenceCode}
              Header={
                id && lastStatus.Type !== "FIN" && isAdminUser
                ? <>
                    {isAdmin && <AssignAction
                      RequestId={requestData.Id}
                      RequestType="Transportation"
                      onSuccess={GetTransportationRequestData} />}
                    {isAllowActions ? <HoldAction
                      RequestId={requestData.Id}
                      RequestType="Transportation"
                      onSuccess={GetTransportationRequestData} /> : null}
                    {isAllowActions ? <MarkAsDoneAction 
                      RequestType="Transportation" 
                      ModalTitle={`.:: ${requestData.ReferenceCode} ::.`} 
                      idName="Id" idVal={requestData.Id} 
                      onSuccess={GetTransportationRequestData} /> : null}
                  </>
                : null
              }
              Email={id ? requestData?.ByUser?.Mail : user_data?.Data?.Mail}
              UserName={id ? requestData?.ByUser?.DisplayName : user_data?.Data?.DisplayName}
              UserTitle={id ? requestData?.ByUser?.Title : user_data?.Data?.Title}
              UserDept={id ? requestData?.ByUser?.Department : user_data?.Data?.Department}
              UserNationality={id ? requestData?.ByUser?.Nationality : user_data?.Data?.Nationality || ' - '}
              UserId={id ? requestData.ByUser?.Iqama || ' - ' : user_data.Data?.Iqama || ' - '}
              EmployeeId={id ? parseInt(requestData.ByUser?.PIN, 10) || ' - ' : parseInt(user_data.Data?.PIN, 10) || ' - '}
              Extension={id ? requestData.ByUser?.Ext || ' - ' : user_data.Data?.Ext || ' - '}      
              tipsList={[
                "Fill out required fields carefully.",
                "Check your email regularly. You will receive a notification on every future actions",
                "For additional information, Please contact administrative office or call us at +966 55 5040 314"
              ]}
            >
              <Form 
                {...layout} 
                colon={false}
                labelWrap 
                name="transportation-request" 
                layout="horizontal"
                form={form} 
                onFinish={CreateTransportationRequest}
                onFinishFailed={() => message.error("Please, fill out the form correctly.")}
              >

                

                <Form.Item name="Date" label="Date" rules={[{required: true,}]}>
                  {
                    !id
                    ? <DatePicker showTime format="MM/DD/YYYY HH:mm" disabledDate={(current) => current.isBefore(moment().subtract(1,"day"))} size='large' /* onChange={} onOk={} */ />
                    : <Input size='large' disabled defaultValue={moment(requestData.Date).format("MM/DD/YYYY hh:mm")} />
                  }
                </Form.Item>
                <Form.Item name="From" label="From" rules={[{required: true}]} initialValue={id ? requestData.From : ''} style={{marginBottom: '12px'}}>
                  <Input placeholder='' size='large' gutter={10} disabled={id ? true : false} />
                </Form.Item>
                <Form.Item name="FromLink" label="From Link" initialValue={id ? requestData.FromLink : ''} rules={[{required: true}]} >
                  <Search 
                    placeholder="google map link" 
                    allowClear
                    disabled={id ? true : false}
                    enterButton={<a href='https://www.google.com/maps' target="blank"><EnvironmentOutlined /></a>}
                  />
                </Form.Item>
                <Form.Item name="To" label="To" rules={[{required: true}]} initialValue={id ? requestData.To : ''} style={{marginBottom: '12px'}}>
                  <Input placeholder='' size='large' gutter={10} disabled={id ? true : false} />
                </Form.Item>
                <Form.Item name="ToLink" label="To Link" initialValue={id ? requestData.ToLink : ''} rules={[{required: true}]} >
                  <Search 
                    placeholder="google map link" 
                    allowClear
                    disabled={id ? true : false}
                    enterButton={<a href='https://www.google.com/maps' target="blank"><EnvironmentOutlined /></a>}
                  />
                </Form.Item>
                <hr />
                
                <Form.Item name="ServiceType" label="Serivce Type" initialValue={id ? requestData.ServiceType : 'OneWay'}>
                  <Radio.Group
                    options={[{label: 'One Way', value: 'OneWay'}, {label: 'Round Trip', value: 'RoundTrip'}]}
                    onChange={ ({target: {value}}) => setSerivceType(value) }
                    value={serivceType}
                    optionType="button"
                    buttonStyle="solid"
                    style={{width: '100%'}}
                    size="large"
                    defaultValue="One Way"
                    disabled={id ? true : false}
                  />
                </Form.Item>
                {serivceType === 'RoundTrip' || (id && requestData.WaitingTime !== "")
                ? <Form.Item name="WaitingTime" label="Waiting Time" initialValue={id ? requestData.WaitingTime : ''}>
                    <Input placeholder='' size='large' disabled={id ? true : false} />
                  </Form.Item> : null}
                
                <hr />
                
                <div className='admin-services-table'>
                  <EditableTable dataSource={passenger} setDataSource={setPassenger} PreviewMode={id ? true : false} />
                </div>
                <hr />

                
                {!id && <SubmitCancel loaderState={btnLoading} isUpdate={id ? true : false} backTo="/admin-services" />}
              </Form>

              {
                id && 
                <div className='admin-services-table'>
                  <ActionsTable ActionData={requestData.Status || []} />
                </div>
              }
            </FormPage>
          )
        : <AntdLoader />
      }
      
    </>
  )
}

export default Transportation