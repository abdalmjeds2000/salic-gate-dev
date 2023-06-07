import React, { useContext, useEffect, useState } from 'react'
import './ESignRequests.css';
import { CheckCircleOutlined, CheckOutlined, DeleteOutlined, FileTextOutlined, MoreOutlined, PlusOutlined, StopOutlined, SyncOutlined } from '@ant-design/icons'
import { Button, Col, Dropdown, Form, Input, Menu, message, Popconfirm, Row, Select, Space, Table, Tag, Typography } from 'antd'
import { AppCtx } from '../../../App';
import axios from 'axios';
import VerifySignatureModal from './Actions/VerifySignatureModal';
import ResendInvitation from './Actions/ResendInvitation';
import ShareWith from './Actions/ShareWith';
import { GoCheck } from 'react-icons/go';
import { VscChromeClose } from 'react-icons/vsc';
import AntdLoader from '../../../Global/AntdLoader/AntdLoader';
import DropdownSelectUser from '../../../Global/DropdownSelectUser/DropdownSelectUser';


/* function for encode base64 like key={key}&documentId={11} */
/* take documentId and key */
function encodeBase64(key, documentId) {
  const encoded = `key=${key}&documentId=${documentId}`.toString('base64');
  return window.btoa(unescape(encodeURIComponent(encoded)));
;
}


function ESignRequests() {
  const { user_data, eSign_requests, setESignRequests } = useContext(AppCtx)
  const [loading, setLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    const response = await axios.get(`https://dev.salic.com/api/signature/MyRequests?Email=${user_data?.Data?.Mail}`)
    setESignRequests(response.data?.Data);
    setLoading(false);
  }
  useEffect(() => {
    if(Object.keys(user_data)?.length > 0 && eSign_requests?.length === 0) {
      fetchData();
    }
  }, [user_data]);

  // Row Menu Withdraw Or Enable
  const confirmWithdrawOrEnable = (Id, IsActive) => {
    axios({
      method: 'POST',
      url: 'https://dev.salic.com/api/Signature/Withdraw',
      data: {DocumentId: Id, Status: IsActive ? false : true}
    }).then((res) => {
      message.success(`Success, Document Is ${IsActive ? 'Withdraw' : 'Enable'} Now!`, 3);
    }).then(() => {
      const setESignRequestsUpdated = eSign_requests.map(row => {
        if(row.Id === Id) {
          if(row.IsActive === true) {
            row.IsActive = false
            return row
          }
          else if(row.IsActive === false){
            row.IsActive = true
            return row
          }
        }
        return row
      })
      setESignRequests(setESignRequestsUpdated)
    }).catch(() => message.error('Failed', 3))
  }
  // Row Menu Delete
  const confirmDelete = (Id) => {
    axios({
      method: 'GET',
      url: `https://dev.salic.com/api/Signature/Delete?DocumentId=${Id}`
    }).then((res) => {
      message.success(res.data.Message, 3)
    }).then(() => {
      const setESignRequestsUpdated = eSign_requests.filter(row => row.Id !== Id)
      setESignRequests(setESignRequestsUpdated)
    }).catch(() => message.error('Failed', 3))
  }
  // Row Menu 
  const menu = (Id, IsActive, Status, Key) => {
    const Items = [
      {
        key: '4',
        label: (<a href={`https://salic-esign-dev.vercel.app/file?key=${encodeBase64(Key, Id)}`} target="_blank"><FileTextOutlined /> Show Document</a>),
      },
      {
        key: '1',
        label: (
          <Popconfirm
            title="Are you sure ?"
            onConfirm={() => confirmWithdrawOrEnable(Id, IsActive)}
            okText={IsActive ? 'Withdraw' : 'Enable'}
            cancelText="Cancel"
          >
            <a>
              {IsActive ? <><StopOutlined /> Withdraw</> : <><CheckOutlined /> Enable</>}
            </a>
          </Popconfirm>
        ),
      },
      {
        key: '2',
        label: (
          <ResendInvitation Id={Id} />
        ),
      },Status === 'Pending' ? {
        key: '3',
        label: (
          <ShareWith Id={Id} />
        ),
      } : null,
      {
        key: '5',
        label: (
          <Popconfirm
            title="Are you sure ?"
            onConfirm={() => confirmDelete(Id)}
            okText='Delete'
            cancelText="Cancel"
          >
            <a style={{color: '#ff272b !important'}}>
              <DeleteOutlined /> Delete
            </a>
          </Popconfirm>
        ),
        danger: true
      }
    ]
    return <Menu items={Items} />
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'Number',
      width: '3%',
      render: (_, row) => eSign_requests?.indexOf(row) + 1
    },{
      title: 'Subject',
      dataIndex: 'EmailSubject',
      width: '100%',
      render: (text, row) => {
        return (
          <div className='eSign-subject'>
            <Typography.Link href={`https://salic-esign-dev.vercel.app/file?key=${encodeBase64(row.Key, row.Id)}`} target='_blank' style={{display: 'inline'}}>
              {!row.IsActive ? <StopOutlined style={{color: 'var(--brand-red-color)'}} /> : null} {text}
            </Typography.Link>
            <span className='eSign-more-btn'>
              <Dropdown overlay={menu(row.Id, row.IsActive, row.Status, row.Key)} trigger={['click']}>
                <Typography.Link strong style={{marginLeft: '15px'}}><MoreOutlined /></Typography.Link>
              </Dropdown>
            </span>
          </div>
        )
      },
    },{
      title: 'Request Date',
      dataIndex: 'Created',
      key: 'Created',
      width: '10%',
      render: v => <div style={{minWidth: 170}}>{new Date(v).toLocaleString()}</div>
    },{
      title: 'Recipients',
      dataIndex: 'NumOfRecipients',
      key: 'NumOfRecipients',
      width: '5%',
      render: v => <div style={{textAlign: 'center'}}>{v}</div>
    },{
      title: 'Is Parallel',
      dataIndex: 'IsParallel',
      key: 'IsParallel',
      width: '5%',
      render: val => <div style={{minWidth: 90}}>{val ? <span><GoCheck style={{color: 'var(--brand-green-color)'}} /> True</span> : <span><VscChromeClose style={{color: 'var(--brand-red-color)'}} /> False</span>}</div>
    },{
      title: 'Has Reminder',
      dataIndex: 'RemindUsers',
      width: '5%',
      render: val => <div style={{minWidth: 110}}>{val ? <span><GoCheck style={{color: 'var(--brand-green-color)'}} /> True</span> : <span><VscChromeClose style={{color: 'var(--brand-red-color)'}} /> False</span>}</div>
    },{
      title: 'Pending With',
      dataIndex: 'PendingWith',
      key: 'PendingWith',
      width: '20%',
      render: (val) => {
        if(val && val?.startsWith('[')) {
          return (
            <ul>
              {
                Array.isArray(JSON.parse(val || '[]'))
                ? (
                  JSON.parse(val || '[]')?.map(u => <li>{u?.Email}</li>)
                ) : null
              }
            </ul>
          )
        }
        return ''
      }
    },{
      title: 'Status',
      dataIndex: 'Status',
      key: 'Status',
      width: '14%',
      render: (val) => {
        switch(val) {
          case "COMPLETED":
            return <div style={{minWidth: 100}}><Tag icon={<CheckCircleOutlined />} color="success">Completed</Tag></div>
          case "Draft":
            return <div style={{minWidth: 100}}><Tag icon={<SyncOutlined />} color="warning">Pending</Tag></div>
          default:
            return <div style={{minWidth: 100}}><Tag color="default">{val}</Tag></div>
        }
      }
    },{
      title: 'Signed Document',
      dataIndex: 'SignedDocument',
      width: '8%',
      render: (val, record) => (
        val
          ? <a style={{textAlign: 'center', minWidth: 120, display: 'block'}} href={`https://dev.salic.com/api/Signature/Download?eDocumentId=${record.Id}`} target='blank'>Download</a>
          : ''
      )
    },{
      title: 'Preview Version',
      dataIndex: '',
      width: '8%',
      render: (_, record) => (
        !record.SignedDocument 
          ? <a style={{textAlign: 'center', minWidth: 120, display: 'block'}} href={`https://dev.salic.com/api/Signature/DownloadCurrentVersion?eDocumentId=${record.Id}`} target='blank'>Download</a>
          : ''
      )
    }
  ];




  const handleFilter = async (values) => {
    setFilterLoading(true);
    const params = {};
    Object.keys(values)?.forEach(key => {
      if(values[key]) params[key] = values[key]; 
    });
    let queryStr = Object.keys(params).map(key => {
      let encodeValue = encodeURIComponent(params[key]);
      return `${key}=${encodeValue}`;
    }).join('&');

    const url = `https://dev.salic.com/api/signature/MyRequests?Email=${user_data?.Data?.Mail}&${queryStr}`
    const response = await axios.get(url);
    setESignRequests(response.data?.Data);

    setFilterLoading(false);
  }



  if(loading) {
    <AntdLoader />
  }
  return (
    <div className='eSign-requests-container'>
      <div className='header'>
        <h1>eSign Requests</h1>
        <div className='controls'>
          {/* <Button type="primary" size='small' onClick={}><RedoOutlined /> Refresh</Button> */}
          <VerifySignatureModal />
          <Button size='small' href='https://devsalic.sharepoint.com/sites/newsalic/SitePages/eSign/NewRequest.aspx' target='blank'><PlusOutlined /> New Request</Button>
        </div>
      </div>

      <div className='table'>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Form form={form} onFinish={handleFilter} layout='vertical' onReset={() => fetchData()}>
              <Row gutter={[12, 12]}>
                <Col xs={24} md={12} lg={8}>
                  <Form.Item name="Subject" label="Subject" style={{ marginBottom: 0 }}>
                    <Input size='large' placeholder='document subject' />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={8}>
                  <Form.Item name="Status" label="Status" initialValue='Draft' style={{ marginBottom: 0 }}>
                    <Select
                      size='large'
                      placeholder="document status"
                      allowClear
                      options={[
                        { value: 'COMPLETED', label: 'Completed' },
                        { value: 'Draft', label: 'Draft' },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={8}>
                  <Form.Item label="Invitee" style={{ marginBottom: 0 }}>
                    <DropdownSelectUser
                      name="Invitee"
                      required={false}
                      placeholder="invitee users"
                    />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Space style={{ justifyContent: 'flex-end', width: '100%' }} >
                    <Button htmlType='reset' type='ghost' disabled={filterLoading || loading}>Reset</Button>
                    <Button htmlType='submit' type='primary' loading={filterLoading} disabled={loading}>Filter</Button>
                  </Space>
                </Col>
              </Row>
            </Form>
          </Col>

          <Col xs={0} md={24}>
            <Table 
              columns={columns} 
              dataSource={eSign_requests} 
              pagination={{position: ['none', 'bottomCenter'], pageSize: 50, hideOnSinglePage: true }} 
            />
          </Col>
          <Col xs={24} md={0}>
            <Table 
              columns={columns?.filter(r => r.dataIndex === 'Number' || r.dataIndex === 'EmailSubject')} 
              dataSource={eSign_requests} 
              pagination={{position: ['none', 'bottomCenter'], pageSize: 50, hideOnSinglePage: true }} 
              rowKey={record => record.Id}
              expandable={{
                expandedRowRender: (record) => (
                  <div style={{paddingLeft: '10px'}}>
                    <><b>Status: </b>{<><span style={{ fontSize: '2.5rem', lineHeight: 0, position: 'relative', top: '7px', color: record.Status === 'COMPLETED' ? 'rgb(39, 124, 98)' : 'rgb(233 155 77)'}}>•</span>{record.Status}</>}</><br/>
                    <>
                      <b>Pending With: </b>
                      {record?.PendingWith && record?.PendingWith?.startsWith('[')
                        ? (
                          <ul>
                            {
                              Array.isArray(JSON.parse(record?.PendingWith || '[]'))
                              ? (
                                JSON.parse(record?.PendingWith || '[]')?.map(u => <li>{u?.Email}</li>)
                              ) : null
                            }
                          </ul>
                        ) : null
                      }
                    </><br/>
                    <><b>Request Date: </b><div>{new Date(record.Created).toLocaleString()}</div></><br/>
                    <><b>Recipients: </b>{record.NumOfRecipients}</><br/>
                    <><b>Is Parallel: </b>
                      <div>{record.IsParallel ? <span><GoCheck style={{color: 'var(--brand-green-color)'}} /> True</span> : <span><VscChromeClose style={{color: 'var(--brand-red-color)'}} /> False</span>}</div>
                    </><br/>
                    <><b>Has Reminder: </b>
                      <div>{record.RemindUsers ? <span><GoCheck style={{color: 'var(--brand-green-color)'}} /> True</span> : <span><VscChromeClose style={{color: 'var(--brand-red-color)'}} /> False</span>}</div>
                    </><br/>
                    <><b>Signed Document: </b>{
                      record.SignedDocument
                        ? <a href={`https://dev.salic.com/api/Signature/Download?eDocumentId=${record.Id}`} target='blank'>Download</a>
                        : ''
                    }</><br/>
                    <><b>Preview Version: </b>{
                      !record.SignedDocument 
                        ? <a href={`https://dev.salic.com/api/Signature/DownloadCurrentVersion?eDocumentId=${record.Id}`} target='blank'>Download</a>
                        : ''
                    }</><br/>
                  </div>
                ),
              }}
            />
          </Col>
        </Row>
      </div>

    </div>
  )
}

export default ESignRequests