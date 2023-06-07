import React, { useContext, useEffect, useState } from 'react'
import { Form, Input, message, notification } from 'antd';
import { useNavigate, useParams } from 'react-router-dom'
import HistoryNavigation from '../../../Global/HistoryNavigation/HistoryNavigation';
import FormPage from '../../components/FormPageTemplate/FormPage';
import SubmitCancel from '../../components/SubmitCancel/SubmitCancel';
import { AppCtx } from '../../../App';
import moment from 'moment';
import MaintenanceRequest from './API/MaintenanceRequest';
import GetMaintenanceRequestById from './API/GetMaintenanceRequestById';
import ActionsTable from '../../components/ActionsTable/ActionsTable';
import MarkAsDoneAction from '../AddAction/MarkAsDoneAction';
import AntdLoader from '../../../Global/AntdLoader/AntdLoader';
import useIsAdmin from '../../../Hooks/useIsAdmin';
import AssignAction from '../AddAction/AssignAction';
import HoldAction from '../AddAction/HoldAction';

moment.locale('en');
const layout = { labelCol: { span: 6 }, wrapperCol: { span: 12 } };



function Maintenance() {
  const [form] = Form.useForm();
  const { user_data, defualt_route } = useContext(AppCtx);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  let navigate = useNavigate();
  const { id } = useParams();
  const [requestData, setRequestData] = useState({});
  const [isAdmin] = useIsAdmin("Maintenance Admins");
  const [isAdminUser] = useIsAdmin("Admin Users");


  async function CreateMaintenanceRequest(values) {
    setBtnLoading(true);

    const form_values = {
      Email: user_data?.Data?.Mail,
      ReferenceCode: "auto generated",
      Files: "",
      Id: 0,
      ...values
    }
    var form_data = new FormData();
    for ( var key in form_values ) {
      form_data.append(key, form_values[key]);
    }
    const response = await MaintenanceRequest(form_data);
    if(response?.status == 200) {
      form.resetFields();
      notification.success({message: response?.data?.Message || "Your Application has been submitted successfully."})
      if(response?.data?.Data) {
        navigate(defualt_route + "/admin-services/my-requests");
        window.open(defualt_route + '/admin-services/maintenance/' + response?.data?.Data);
      }
    } else {
      message.error("Failed to send request.")
    }

    setBtnLoading(false);
  }

  async function GetMaintenanceRequestData() {
    setLoading(true);
    const response = await GetMaintenanceRequestById(user_data.Data.Mail, id);
    if(response.data.Status === 200 && response.data.Data.length > 0) {
      document.title = `.:: SALIC Gate | ${response.data.Data[0].ReferenceCode || "Maintenance Request"} ::.`
      setRequestData(response.data.Data[0])
    } else {
      message.error("Error Get Request Data")
    }
    setLoading(false);
  }

  useEffect(() => {
    if(id) {
      if(Object.keys(user_data).length > 0 && Object.keys(requestData).length === 0) {
        GetMaintenanceRequestData();
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
        <p>{!id && 'New '}Maintenance Request</p>
      </HistoryNavigation>
      {
        !loading
        ? <FormPage
            Email={id ? requestData?.ByUser?.Mail : user_data?.Data?.Mail}
            pageTitle={!id ? 'New Maintenance Request' : requestData.ReferenceCode}
            Header={
              id && lastStatus.Type !== "FIN" && isAdminUser
              ? <>
                  {isAdmin && <AssignAction 
                    RequestId={requestData.Id}
                    RequestType="Maintenance"
                    onSuccess={GetMaintenanceRequestData} />}
                  { isAllowActions ? <HoldAction
                    RequestId={requestData.Id}
                    RequestType="Maintenance"
                    onSuccess={GetMaintenanceRequestData} /> : null}
                  { isAllowActions ? <MarkAsDoneAction 
                    RequestType="Maintenance" 
                    ModalTitle={`.:: ${requestData.ReferenceCode} ::.`} 
                    idName="Id" idVal={requestData.Id} 
                    onSuccess={GetMaintenanceRequestData} /> : null}
                </>
              : null
            }
            UserName={id ? requestData?.ByUser?.DisplayName : user_data?.Data?.DisplayName}
            UserTitle={id ? requestData?.ByUser?.Title : user_data?.Data?.Title}
            UserDept={id ? requestData?.ByUser?.Department : user_data?.Data?.Department}
            UserNationality={id ? requestData?.ByUser?.Nationality : user_data?.Data?.Nationality || ' - '}
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
              form={form}
              colon={false}
              labelWrap 
              name="service-request" 
              onFinish={CreateMaintenanceRequest} 
              onFinishFailed={() => message.error("Please, fill out the form correctly.")}
              layout="horizontal"
            >

              <Form.Item name='Date' label="Date" rules={[{required: true,}]} initialValue={moment(id ? new Date(requestData.CreatedAt) : new Date()).format("MM/DD/YYYY hh:mm")} >
                <Input placeholder='Date' size='large' disabled />
              </Form.Item>
              
              <hr />

              <Form.Item name="Requester" label="Requester" initialValue={id ? requestData.ByUser?.DisplayName : ''}>
                <Input placeholder='full name' size='large' disabled={id ? true : false}/>
              </Form.Item>
              <Form.Item name="Location" label="Location" rules={[{required: true}]} initialValue={id ? requestData.Location : ''}>
                <Input placeholder='Location' size='large' disabled={id ? true : false}/>
              </Form.Item>
              <Form.Item name="Description" label="Descriptions" rules={[{required: true}]} initialValue={id ? requestData.Description : ''}>
                <Input.TextArea rows={6} placeholder="write a brief description" disabled={id ? true : false}/>
              </Form.Item>

              
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

export default Maintenance