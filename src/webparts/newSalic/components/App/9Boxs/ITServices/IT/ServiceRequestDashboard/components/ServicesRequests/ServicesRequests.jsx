import React, { useContext, useEffect, useState } from 'react';
import { Button, Popover, Space, Table, Tooltip, Typography } from 'antd';
import moment from 'moment';
import { AppCtx } from '../../../../../../App';
import UserColumnInTable from '../../../../../../Global/UserColumnInTable/UserColumnInTable';
import { CloseCircleOutlined, FileExcelOutlined, FilterOutlined, InfoCircleOutlined, RedoOutlined } from '@ant-design/icons';
import axios from 'axios';
import HoverTicketDescription from './HoverTicketDescription';


function ServicesRequests(props) {
  const { ITRequests, setITRequests, defualt_route, isAppInSearch } = useContext(AppCtx);
  const [isFilterActive, setIsFilterActive] = useState(true);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 24,
      total: 0,
      position: ['none', 'bottomCenter'], style: {padding: '25px 0'},
      pageSizeOptions: [10, 20, 24, 50, 100]
    },
  });

  const fetchData = async (signal) => {
    props.setLoading(true);
    const skipItems = tableParams.pagination.pageSize * (tableParams.pagination.current - 1);
    const takeItems = tableParams.pagination.pageSize;
    const orderBy = (tableParams?.field && tableParams.order) ? `${tableParams.field} ${tableParams.order === 'ascend' ? 'asc' : 'desc'}` : 'Id desc';
    const _email = isFilterActive ? props.dataForUser.Mail : '';
    try {
      await axios.get(`https://dev.salic.com/api/tracking/Get?draw=3&order=${orderBy}&start=${skipItems}&length=${takeItems}&search[value]=&search[regex]=false&email=${_email}&query=&_=1668265007659`, { signal: signal })
      .then((res) => {
        setITRequests(res.data.data);
        if(tableParams.pagination.total != res.data.recordsTotal) {
          setTableParams({
            ...tableParams,
            pagination: {
              ...tableParams.pagination,
              total: isFilterActive ? res.data.recordsFiltered : res.data.recordsTotal,
            },
          });
        }
        props.setLoading(false);
      })
    } catch (error) {
      console.log(error);
      props.setLoading(false);
    }
  }
  const controller = new AbortController();
  const signal = controller.signal;
  useEffect(() => {
    if(props.dataForUser) {
      fetchData(signal);
    }
    return () => {controller.abort();};
  }, [isFilterActive, props.dataForUser, tableParams.pagination.current, tableParams.pagination.pageSize, tableParams.field, tableParams.order]);

  useEffect(() => {
    if(!isFilterActive) {
      setIsFilterActive(true);
    }
  }, [props.dataForUser])
  useEffect(() => {
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: 1,
      },
    });
  }, [isFilterActive, props.dataForUser])
  
  // to hide pagination if data short (for search)
  useEffect(() => {
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        style: { ...tableParams.pagination.style, display: isAppInSearch ? 'none' : 'flex' }
      },
    });
  }, [isAppInSearch]);

  const handleTableChange = (pagination, filters, sorter) => {
    if(sorter.field === 'Requester') sorter.field = 'Requester.DisplayName';
    if(sorter.field === 'PendingWith') sorter.field = 'PendingWith.DisplayName';
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };


  var mobile = (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));

  const columns = [
    {
      title: 'SR. #',
      dataIndex: 'Id',
      width: '6%',
      sorter: true,
      render: (val) => <b>{`SR[#${val}]`}</b>
    },{
      title: 'Date & Time',
      dataIndex: 'CreatedAt',
      width: '12%',
      sorter: true,
      render: (val) => <div style={{minWidth: 140}}>{moment(val).format('MM/DD/YYYY hh:mm:ss')}</div>
    },{
      title: 'Subject',
      dataIndex: 'Subject',
      width: '32%',
      sorter: true,
      render: (val, record) => (
        <Space direction='horizontal' style={{minWidth: 220}}>
          <Popover destroyTooltipOnHide content={<HoverTicketDescription RequestId={record.Id} />} overlayInnerStyle={{ color: '#333', width: 'fit-content', overflow: 'auto', minWidth: 400, maxWidth: '100vh', maxHeight: 400 }}>
            <InfoCircleOutlined style={{color: record.Priority === "1" ? "#0c508c" : "#ff272b"}} /> 
          </Popover>
          <div>
            <Typography.Link href={defualt_route + `/services-requests/${record.Id}`} target={!mobile ? "_blank" : ""}>
              {val}
            </Typography.Link>
            {
              record.Tags && Array.isArray(record.Tags) && record.Tags.length > 0 ? (
                <>
                  <br />
                  <Typography.Text type='secondary' style={{fontSize: 12}}>
                    {record?.Tags?.map((mention, index) => (
                      <Typography.Link key={index} href={`https://devsalic.sharepoint.com/_layouts/15/me.aspx/?p=${mention?.email}&v=work`} target='_blank' style={{color: '#c61316', marginRight: 5}}>{`@${mention.name}`}</Typography.Link>
                    ))}
                  </Typography.Text>
                </>
              ) : null
            }
          </div>
        </Space>
      )
    },{
      title: 'Requester',
      dataIndex: 'Requester',
      width: '16%',
      sorter: true,
      render: (val) => <div style={{minWidth: 180}}><UserColumnInTable Mail={val?.Mail} DisplayName={val?.DisplayName} /></div>
    },{
      title: 'Assgined To',
      dataIndex: 'PendingWith',
      width: '16%',
      sorter: true,
      render: (val, record) => <div style={{minWidth: 180}}><UserColumnInTable Mail={val?.Mail || record.ClosedBy?.Mail} DisplayName={val?.DisplayName || record.ClosedBy?.DisplayName} /></div>
    },{
      title: 'Status',
      dataIndex: 'Status',
      width: '8%',
    },{
      title: 'Request Type',
      dataIndex: 'RequestType',
      sorter: true,
      width: '10%',
    }
  ];





  const ControlPanel = (
    <Space direction='horizontal'>
      <Button size='small' onClick={() => setIsFilterActive(!isFilterActive)} icon={isFilterActive ? <CloseCircleOutlined /> : <FilterOutlined />}>{isFilterActive ? 'Remove Filter' : 'Apply Filter'}</Button>
      <Button
        size='small' 
        type='primary' 
        onClick={() => window.open("https://dev.salic.com/api/Tracking/ExportData?ServiceRequestId=&ClosedBy=&EmailAddress=&RequestType=&PendingWith=&CreatedFrom=&CreatedTo=", "_blank")}
      >
        <FileExcelOutlined /> Export
      </Button>
      <Button type='primary' size='small' loading={props.loading} onClick={_ => fetchData(signal)} icon={<RedoOutlined />}>Refresh</Button>
    </Space>
  );



  return (
    <div className="table-page-container it-service-requests-table-container" style={{top: 0, marginBottom: 25, padding: 0}}>
      <div className='content'>
        <div className="header" style={{borderRadius: 0}}>
          <h1>IT Service Requests</h1>
          <div>{ControlPanel}</div>
        </div>

        {ITRequests && ITRequests.length > 0 && (
          <div className='form' style={{overflowX: 'auto'}}>
            <Table
              columns={columns}
              dataSource={ITRequests}
              pagination={tableParams.pagination}
              loading={props.loading}
              onChange={handleTableChange}
              showSorterTooltip={false}
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
          </div>
        )}
      </div>
    </div>
  )
}

export default ServicesRequests