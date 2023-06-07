import React, { useContext, useEffect, useState } from 'react';
import './NotificationCenter.css';
import { Button, Checkbox, Modal, Select, Spin, Table, Tag, Tooltip } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, DownOutlined, FileDoneOutlined, LoadingOutlined, RedoOutlined, SyncOutlined } from '@ant-design/icons';
import HistoryNavigation from '../Global/HistoryNavigation/HistoryNavigation';
import { AppCtx } from '../App';
import axios from 'axios';
import moment from 'moment';
import { useLocation, useNavigate } from 'react-router-dom';


const oracleFrom = ['saas', 'paas'];
const defualt_types = ['Oracle', 'eSign', 'SharedServices'];

function NotificationCenter() {
  const { user_data, defualt_route, notifications_data, setNotificationsData } = useContext(AppCtx);
  let navigate = useNavigate();

  const [dataCount, setDataCount] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [selectedType, setSelectedType] = useState(defualt_types);
  const [selectedStatus, setSelectedStatus] = useState(['Pending']);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);

  const location = useLocation();
  let customEmail = null;
  if(user_data?.Data?.Mail?.toLowerCase() === "Akmal.Eldahdouh@salic.com".toLowerCase()) {
    customEmail = decodeURI(location.search).split('?email=')[1];
  }


  const redirectAction = (from, id) => {
    switch(from) {
      case "VISA":
        navigate(defualt_route + '/admin-services/issuing-VISA/' + id);
        break;
      case "Business Gate":
        navigate(defualt_route + '/admin-services/business-gate/' + id);
        break;
      case "Shipment":
        navigate(defualt_route + '/admin-services/shipment/' + id);
        break;
      case "Office Supply":
        navigate(defualt_route + '/admin-services/office-supply/' + id);
        break;
      case "Maintenance":
        navigate(defualt_route + '/admin-services/maintenance/' + id);
        break;
      case "Transportation":
        navigate(defualt_route + '/admin-services/transportation/' + id);
        break;
      case "Visitor":
        navigate(defualt_route + '/admin-services/visitor/' + id);
        break;
      default:
        return null;
    }
  }

  const fetchRowsCount = async (status) => {
    const _status = status.join(',');
    const url = `https://dev.salic.com/api/NotificationCenter/Summary?Email=${customEmail || user_data?.Data?.Mail}&Status=${_status.replace(/[,]/g, '%2C')}`
    const response = await axios.get(url);
    if(response.data?.Status == 200 && response.data?.Data) {
      setDataCount(response.data.Data);
    }
  }
  const fetchData = async (types, status, signal, noLoader) => {
    !noLoader ? setLoading(true) : null;
    const _types = types.join(',');
    const _status = status.join(',');
    let url = `https://dev.salic.com/api/notificationcenter/Get?Email=${customEmail || user_data?.Data?.Mail}&draw=1&order%5B0%5D%5Bcolumn%5D=0&order%5B0%5D%5Bdir%5D=asc&start=0&length=-1&search%5Bvalue%5D=&search%5Bregex%5D=false&%24orderby=Created+desc&%24top=1&Type=${_types.replace(/[,]/g, '%2C')}&Status=${_status.replace(/[,]/g, '%2C')}&_=1671286356550`;
    const response = await axios.get(url, {signal: signal})
    if(response?.data?.Status == 200 && response?.data?.Data && response?.data?.Data?.length > 0) {
      setNotificationsData(response.data?.Data);
    } else setNotificationsData([]);
    !noLoader ? setLoading(false) : null;
  }


  // Get Notification Center Data Every Change on Filter
  useEffect(() => {
    if(Object.keys(user_data).length > 0) {
      const controller = new AbortController();
      const signal = controller.signal;
      fetchData(selectedType, selectedStatus, signal);
      fetchRowsCount(selectedStatus);
      //cleanup function
      return () => {controller.abort();};
    }
  }, [user_data, selectedType, selectedStatus, count]);

  // Get Notification Center Data Every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData(selectedType, selectedStatus, null, true);
      fetchRowsCount(selectedStatus);
      console.log(customEmail, user_data?.Data?.Mail);
    }, 30000)
    return () => clearInterval(interval);
  }, [user_data, selectedType, selectedStatus]);

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      width: '3%',
      render: (_, record) => `${notifications_data.indexOf(record) + 1}`
    },{
      title: 'Subject',
      key: 'subject',
      width: '57%',
      render: (_, record) => {
        return <div className='notification-subject'><h3>{record.Title}</h3>{record.BodyPreview}</div>
      }
    },{
      title: 'Source',
      dataIndex: 'TypeLabel',
      width: '8%',
      render: (val) => {
        return <div style={{minWidth: 120}}>{val}</div>
      }
    },{
      title: 'Original Source',
      dataIndex: 'OriginalLink',
      width: '8%',
      render: (val) => {
        if(!val) {
          return ' - '
        }
        return <a href={val} target="_blank" style={{minWidth: 120}}>Click Here</a>
      }
    },{
      title: 'Date Time',
      dataIndex: 'Created',
      key: 'dateTime',
      width: '8%',
      render: (val) => <div style={{minWidth: 120}}>{moment(val).format('MM/DD/YYYY hh:mm')}</div>
    },{
      title: 'Status',
      dataIndex: 'Status',
      key: 'Status',
      width: '8%',
      render: (val) => {
        const v = typeof val == "string" ? val?.toLowerCase() : "";
        switch(v) {
          case "pending":
            return <Tag icon={<SyncOutlined />} color="warning">Pending</Tag>
          case "approved":
            return <Tag icon={<CheckCircleOutlined />} color="success">Approved</Tag>
          case "rejected":
            return <Tag icon={<CloseCircleOutlined />} color="error">Rejected</Tag>
          case "closed":
            return <Tag icon={<FileDoneOutlined />} color="default">Closed</Tag>
          case "submitted":
            return <Tag icon={<SyncOutlined />} color="processing">Submitted</Tag>
          default:
            return <Tag color="default">{val}</Tag>;
        }
      }
    },{
      title: 'Action',
      dataIndex: 'Body',
      width: '8%',
      render: (val, record) => {
        const status = typeof record.Status == "string" ? record.Status?.toLowerCase() : "";
        const linkLabel = status === 'pending' ? "Take an action" : "View";
        if(record.From === 'ServiceRequest') {
          record.Body = `<div class="fix-margin">${record.Body}</div>`
        }
        return <div style={{minWidth: 120}} className={status === "pending" ? "action-link" : ""}>
          {
            oracleFrom.includes(record.From?.toLowerCase())
              ? <a href={`#${record.Id}`} onClick={() => {setOpenModal(true); setModalData(record);}}>{linkLabel}</a>
            : record.From === 'eSign'
              ? <a href={`https://salic-esign-dev.vercel.app/verify?key=${val}`} target='_blank'>{linkLabel}</a>
            : record.From === 'ServiceRequest'
              ? <a href={`#${record.Id}`} onClick={() => {setOpenModal(true); setModalData(record);}}>{linkLabel}</a>
            : record.From === 'DeliveryNote'
              ? <a href={`#${record.Id}`} onClick={() => {setOpenModal(true); setModalData(record);}}>{linkLabel}</a>
            : <a onClick={() => redirectAction(record.From, record.Id)}>{linkLabel}</a>
          }
        </div>
      }
    }
  ];



  return (
    <>
      <HistoryNavigation>
        <p>Notification Center</p>
      </HistoryNavigation>
      
      <div className='notification-center-container'>
        <div className='notification-center_content'>
          {
            loading ? (
              <div className='notification-loader'>
                <Spin indicator={<LoadingOutlined spin />} />
              </div>
            ) : (
              null
            )
          }

          <div className="notification_type-container">
            <Tooltip title="Oracle SaaS, Oracle PaaS">
              <div className="notification_type"
                style={{backgroundColor: selectedType.includes('Oracle') ? 'var(--main-color)' : 'var(--brand-orange-color)'}}
                onClick={() => setSelectedType(prev => {
                  if(prev.includes('Oracle')) {
                    return prev.filter(t => t !== 'Oracle')
                  } else {
                    return [...prev, 'Oracle']
                  }
                })}
              >
                <div className='text'>
                  <h1>{dataCount.Oracle || '0'}</h1>
                  <h2>Oracle</h2>
                </div>
                <DownOutlined />
              </div>
            </Tooltip>
            <Tooltip title="eSign Requests">
              <div className="notification_type"
                style={{backgroundColor: selectedType.includes('eSign') ? 'var(--main-color)' : 'var(--brand-orange-color)'}}
                onClick={() => setSelectedType(prev => {
                    if(prev.includes('eSign')) {
                      return prev.filter(t => t !== 'eSign')
                    } else {
                      return [...prev, 'eSign']
                    }
                  })
                }
              >
                <div className='text'>
                  <h1>{dataCount.eSign || '0'}</h1>
                  <h2>eSign Tool</h2>
                </div>
                <DownOutlined />
              </div>
            </Tooltip>
            <Tooltip title="IT Service, Admin Service Requests and IT Delivery Note">
              <div className="notification_type"
                style={{backgroundColor: selectedType.includes('SharedServices') ? 'var(--main-color)' : 'var(--brand-orange-color)'}}
                onClick={() => setSelectedType(prev => {
                  if(prev.includes('SharedServices')) {
                    return prev.filter(t => t !== 'SharedServices')
                  } else {
                    return [...prev, 'SharedServices']
                  }
                })}
              >
                <div className='text'>
                  <h1>{dataCount.SharedService || '0'}</h1>
                  <h2>Shared Services</h2>
                </div>
                <DownOutlined />
              </div>
            </Tooltip>
          </div>
          
          <div className='status-bar-mobile'>
            <Select
              mode="tags"
              placeholder="Select Status"
              defaultValue={['Pending']}
              onChange={checkedValues => setSelectedStatus(checkedValues)}
              style={{width: '100%'}}
              options={[{value: "Pending", label: "Pending"}, {value: "Approved", label: "Approved"}, {value: "Rejected", label: "Rejected"}]}
            />
            <Button type='primary' onClick={() => setCount(prev => prev += 1)}><RedoOutlined /></Button>
          </div>

          <div className="table">
            <div className="table-header">
              <h1>{selectedType.length != 0 ? selectedType.map(r => {if(r=="SharedServices"){r = "Shared Services"} return r}).join(', ') + " Requests" : null}</h1>
              <div className='status-bar-desktop'>
                <div className='status-bar'>
                  <b className='status-title'>Status:</b>
                  <Checkbox.Group 
                    defaultValue={['Pending']} 
                    onChange={checkedValues => setSelectedStatus(checkedValues)} 
                  >
                    {/* <Checkbox value="Pending,Submitted_By_IT">Pending</Checkbox>
                    <Checkbox value="Submitted">Submitted By Me</Checkbox> */}
                    <Checkbox value="Pending">Pending</Checkbox>
                    <Checkbox value="Approved">Approved</Checkbox>
                    <Checkbox value="Rejected">Rejected</Checkbox>
                  </Checkbox.Group>
                </div>
                <Tooltip title="Refresh"><Button type='primary' onClick={() => setCount(prev => prev += 1)}><RedoOutlined /></Button></Tooltip>
              </div>
            </div>

            <div className='notifications-table'>
              <Table 
                columns={columns} 
                dataSource={notifications_data} 
                pagination={{position: ['none', 'bottomCenter'], pageSize: 50, hideOnSinglePage: true, style: {paddingTop: '25px'} }} 
              />
            </div>
          </div>
        </div>

        <Modal
          title={`${modalData.From}: ${modalData.Title}`}
          open={openModal}
          onCancel={() => setOpenModal(false)}
          okButtonProps={{ style: {display: 'none'}}}
          className="more-width-antd-modal notifications-modal"
        >
          <div className='body-content'><div dangerouslySetInnerHTML={{__html: modalData.Body}}></div></div>
        </Modal>
      </div>
    </>
  )
}

export default NotificationCenter