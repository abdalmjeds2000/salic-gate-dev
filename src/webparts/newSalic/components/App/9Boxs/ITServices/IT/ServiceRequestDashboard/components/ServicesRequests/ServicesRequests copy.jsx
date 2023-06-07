import React, { useContext, useEffect, useState } from 'react';
import { Button, message, Pagination, Row, Space, Typography } from 'antd';
import moment from 'moment';
import { AppCtx } from '../../../../../../App';
import UserColumnInTable from '../../../../../../Global/UserColumnInTable/UserColumnInTable';
import RequestsTable from '../../../../../../Global/RequestsComponents/RequestsTable';
import { CloseCircleOutlined, FileExcelOutlined, InfoCircleOutlined, RedoOutlined } from '@ant-design/icons';
import axios from 'axios';



function ServicesRequests(props) {
  const { ITRequests, setITRequests, user_data, defualt_route } = useContext(AppCtx);
  const [currentPage, setCurrentPage] = useState(1);
  const [isNoFilter, setIsNoFilter] = useState(false);
  let _pageSize = 24;
  
  const FetchData = async (page, pageSize) => {
    props.setLoading(true);
    const skipItems = pageSize * (page - 1);
    const takeItems = pageSize;

    const _email = isNoFilter ? '' : (props.dataForUser.Mail || user_data.Data?.Mail);
    axios({
      method: 'GET',
      url: `https://dev.salic.com/api/tracking/Get?draw=3&order=Id desc&start=${skipItems}&length=${takeItems}&search[value]=&search[regex]=false&email=${_email}&query=&_=1668265007659`
    }).then((response) => {
      setITRequests({data: response.data?.data, recordsTotal: response.data.recordsTotal});
      setCurrentPage(page);
      props.setLoading(false);
    }).catch(() => {
      message.error("Failed Fetch Services Requests")
    })
  }

  useEffect(() => {
    if(Object.keys(user_data).length > 0 && props.dataForUser) {
      FetchData(1, _pageSize);
    }
  }, [user_data, props.dataForUser, isNoFilter]);
  useEffect(() => {
    setIsNoFilter(false);
  }, [props.dataForUser]);

  // const RemoveFilter = async () => {
    // setIsNoFilter(prev => !prev);

    // axios({
    //   method: 'GET',
    //   url: `https://dev.salic.com/api/tracking/Get?draw=3&order=Id desc&start=0&length=24&search[value]=&search[regex]=false&email=&query=&_=1668265007659`
    // }).then((response) => {
    //   setITRequests({data: response.data?.data, recordsTotal: response.data.recordsTotal});
    //   setCurrentPage(1);
    //   setIsShowRemoveFilterBtn(false);
    //   props.setLoading(false);
    // }).catch(() => {
    //   message.error("Failed Fetch Services Requests")
    // })
  // }


  var mobile = (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));

  const columns = [
    {
      title: 'SR. #',
      dataIndex: 'Id',
      width: '5%',
      render: (val) => <b>{`SR[#${val}]`}</b>
    },{
      title: 'Date & Time',
      dataIndex: 'CreatedAt',
      width: '12%',
      render: (val) => <div style={{minWidth: 120}}>{moment(val).format('MM/DD/YYYY hh:mm:ss')}</div>
    },{
      title: 'Subject',
      dataIndex: 'Subject',
      width: '33%',
      render: (val, record) => (
        <Space direction='horizontal' style={{minWidth: 220}}>
          <InfoCircleOutlined style={{color: record.Priority === "1" ? "#0c508c" : "#ff272b"}} /> 
          <Typography.Link href={defualt_route + `/services-requests/${record.Id}`} target={!mobile ? "_blank" : ""}>
            {val}
          </Typography.Link>
        </Space>
      )
    },{
      title: 'Requester',
      dataIndex: 'Requester',
      width: '16%',
      render: (val) => <div style={{minWidth: 100}}><UserColumnInTable Mail={val?.Mail} DisplayName={val?.DisplayName} /></div>
    },{
      title: 'Assgined To',
      dataIndex: 'PendingWith',
      width: '16%',
      render: (val, record) => <div style={{minWidth: 100}}><UserColumnInTable Mail={val?.Mail || record.ClosedBy?.Mail} DisplayName={val?.DisplayName || record.ClosedBy?.DisplayName} /></div>
    },{
      title: 'Status',
      dataIndex: 'Status',
      width: '8%',
    },{
      title: 'Request Type',
      dataIndex: 'RequestType',
      width: '10%',
    }
  ];





  const ControlPanel = (
    <Space direction='horizontal'>
      <Button size='small' onClick={() => setIsNoFilter(!isNoFilter)}>{!isNoFilter ? <><CloseCircleOutlined /> Remove Filter</> : <>Apply Filter</>}</Button>
      <Button
        size='small' 
        type='primary' 
        onClick={() => window.open("https://dev.salic.com/api/Tracking/ExportData?ServiceRequestId=&ClosedBy=&EmailAddress=&RequestType=&PendingWith=&CreatedFrom=&CreatedTo=", "_blank")}
      >
        <FileExcelOutlined /> Export
      </Button>
      <Button type='primary' size='small' onClick={() => FetchData(1, _pageSize)}><RedoOutlined /> Refresh</Button>
    </Space>
  );



  return (
    <>
      <RequestsTable
        Title="Services Requests"
        HeaderControlPanel={ControlPanel}
        Columns={columns}
        containerStyle={{top: 0, marginBottom: 25, padding: 0}}
        containerClassName='it-service-requests-table-container'
        headerStyle={{borderRadius: 0}}
        DataTable={ITRequests?.data}
        rowClassName={(record, index) => (
          record.Status === "PROCESSING"
            ? "PROCESSING"
          : record.Status === "Waiting For Approval"
            ? "Waiting_For_Approval"
          : record.Status === "SUBMITTED"
            ? "SUBMITTED"
          : ""
        )}
      />
      <Row justify="center" align="middle" style={{width: '100%', marginTop: 25}}>
        <Pagination
          current={currentPage}
          total={ITRequests?.recordsTotal}
          onChange={(page) => FetchData(page, _pageSize)}
          pageSize={_pageSize}
          showTitle
        />
      </Row>
    </>
  )
}

export default ServicesRequests