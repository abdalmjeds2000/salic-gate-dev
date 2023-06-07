import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { Form, DatePicker, message, Input, notification } from 'antd';
import moment from 'moment';
import HistoryNavigation from '../../../Global/HistoryNavigation/HistoryNavigation';
import FormPage from '../../components/FormPageTemplate/FormPage';
import SubmitCancel from '../../components/SubmitCancel/SubmitCancel';
import EditableTable from '../../components/EditableTable/EditableTableBusinessGate';
import { AppCtx } from '../../../App';
import BusinessGateRequest from './API/BusinessGateRequest';
import GetBusinessGateById from './API/GetBusinessGateById';
import ActionsTable from '../../components/ActionsTable/ActionsTable';
import MarkAsDoneAction from '../AddAction/MarkAsDoneAction';
import AntdLoader from '../../../Global/AntdLoader/AntdLoader';
import useIsAdmin from '../../../Hooks/useIsAdmin';
import AssignAction from '../AddAction/AssignAction';
import HoldAction from '../AddAction/HoldAction';

const layout = { labelCol: { span: 6 }, wrapperCol: { span: 12 } };



function BusinessGate() {
  const { user_data, defualt_route } = useContext(AppCtx);
  let navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const { id } = useParams();
  const [requestData, setRequestData] = useState({});
  const [dataSource, setDataSource] = useState([]);
  const [isAdmin] = useIsAdmin("Business Gate Admins");
  const [isAdminUser] = useIsAdmin("Admin Users");


  async function CreateBusinessGateRequest(values) {
    setBtnLoading(true);
    let validation = true;
    for(let key in dataSource) {
      if(dataSource[key].Name === "") validation = false
    }
    if(validation) {
      values.Date = moment(new Date(values.Date)).format('MM/DD/YYYY hh:mm');
      values.EndDate = moment(new Date(values.EndDate)).format('MM/DD/YYYY hh:mm');
      const guests = dataSource.map(g => {
        delete g.key
        return {...g}
      })
      let ifPass_VISAType_prop = false;
      guests.forEach(item => {
        if(item.Car === true) {
          ifPass_VISAType_prop = true;
        }
      })
      if(ifPass_VISAType_prop) {
        values.VISAType = "1";
      }
      const form_values = {
        Email: user_data?.Data?.Mail,
        ReferenceCode: "auto generated",
        Id: "0",
        Files: "",
        ...values,
        Guest: JSON.stringify(guests)
      }
      var form_data = new FormData();
      for ( var key in form_values ) {
        form_data.append(key, form_values[key]);
      }
      const response = await BusinessGateRequest(form_data);
      if(response?.status == 200) {
        form.resetFields();
        setDataSource([]);
        notification.success({message: response?.data?.Message || "Your Application has been submitted successfully."})
        if(response?.data?.Data) {
          navigate(defualt_route + "/admin-services/my-requests");
          window.open(defualt_route + '/admin-services/business-gate/' + response?.data?.Data);
        }
      } else {
        message.error("Failed to send request.")
      }
    } else {
      message.error("Please Fill Form Correctly.")
    }
    setBtnLoading(false);
  }

  async function GetBusinessGateRequestData() {
    setLoading(true);
    const response = await GetBusinessGateById(user_data.Data.Mail, id);
    if(response.data.Status === 200 && response.data.Data.length > 0) {
      document.title = `.:: SALIC Gate | ${response.data.Data[0].ReferenceCode || "Business Gate Request"} ::.`
      setRequestData(response.data.Data[0]);
      setDataSource(JSON.parse(response.data.Data[0].Guests));
    } else {
      message.error("Error Get Request Data")
    }
    setLoading(false);
  }

  useEffect(() => {
    if(id) {
      if(Object.keys(user_data).length > 0 && Object.keys(requestData).length === 0) {
        GetBusinessGateRequestData();
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
        <p>{!id && 'New '}Business Gate Request</p>
      </HistoryNavigation>
      
      {
        !loading
        ? <FormPage
            pageTitle={!id ? 'New Business Gate Entry' : requestData.ReferenceCode}
            Header={
              id && lastStatus.Type !== "FIN" && isAdminUser
              ? <>
                  {isAdmin && <AssignAction 
                    RequestId={requestData.Id}
                    RequestType="BusniessGate"
                    onSuccess={GetBusinessGateRequestData} />}
                  {isAllowActions ? <HoldAction 
                    RequestId={requestData.Id}
                    RequestType="BusniessGate"
                    onSuccess={GetBusinessGateRequestData} /> : null}
                  {isAllowActions ? <MarkAsDoneAction 
                    RequestType="BusniessGate" 
                    ModalTitle={`.:: ${requestData.ReferenceCode} ::.`} 
                    idName="Id" idVal={requestData.Id} 
                    onSuccess={GetBusinessGateRequestData} /> : null} 
                </>
              : null
            }
            Email={id ? requestData?.ByUser?.Mail : user_data?.Data?.Mail}
            UserName={id ? requestData?.ByUser?.DisplayName : user_data?.Data?.DisplayName}
            UserTitle={id ? requestData?.ByUser?.Title : user_data?.Data?.Title}
            UserDept={id ? requestData?.ByUser?.Department : user_data?.Data?.Department}
            UserNationality={id ? requestData?.ByUser?.Nationality : user_data.Data?.Nationality || ' - '}
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
              name="business-gate" 
              layout="horizontal"
              form={form} 
              onFinish={CreateBusinessGateRequest}
              onFinishFailed={() => message.error("Please, fill out the form correctly.")}
            >
              
              { id &&
                <Form.Item name='ReferenceCode' label="Reference Code" initialValue={id ? requestData.ReferenceCode : ''} >
                  <Input size='large' disabled />
                </Form.Item> }

              <Form.Item name="Date" label="Expected Entry Date" rules={[{required: true,}]}>
              {
                !id
                ? <DatePicker
                    showTime 
                    format="MM-DD-YYYY hh:mm" 
                    disabledDate={(current) => current.isBefore(moment().subtract(1,"day"))} 
                    size='large'
                    disabled={id ? true : false}
                  />
                : <Input size='large' disabled defaultValue={moment(requestData.Date).format("MM-DD-YYYY hh:mm")} />
              }
              </Form.Item>
              <Form.Item name="EndDate" label="Expected Exit Date" rules={[{required: true,}]}>
                {
                  !id
                  ? <DatePicker
                      showTime 
                      format="MM-DD-YYYY hh:mm"
                      disabledDate={(current) => current.isBefore(moment().subtract(1,"day"))} 
                      size='large'
                      disabled={id ? true : false}
                    />
                  : <Input size='large' disabled defaultValue={moment(requestData.EndDate).format("MM-DD-YYYY hh:mm")} />
                }
              </Form.Item>
    
              <hr />
              
              <div className='admin-services-table'>
                <EditableTable dataSource={dataSource} setDataSource={setDataSource} PreviewMode={id ? true : false} />
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
        : <AntdLoader />
      }
    </>
  )
}

export default BusinessGate