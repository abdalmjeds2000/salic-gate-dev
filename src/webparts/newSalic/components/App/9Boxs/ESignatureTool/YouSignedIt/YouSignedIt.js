import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Form, Input, Row, Select, Space, Table } from 'antd'
import axios from 'axios';
import { AppCtx } from '../../../App'
import AntdLoader from '../../../Global/AntdLoader/AntdLoader';
import DropdownSelectUser from '../../../Global/DropdownSelectUser/DropdownSelectUser';

function YouSignedIt() {
  const { user_data, eSign_requests_you_signed_it, setESignRequestsYouSignedIt } = useContext(AppCtx)
  const [loading, setLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [form] = Form.useForm();


  const fetchData = async () => {
    setLoading(true);
    const response = await axios.get(`https://dev.salic.com/api/signature/AllRequests?Email=${user_data?.Data?.Mail}`)
    setESignRequestsYouSignedIt(response.data?.Data);
    setLoading(false);
  }
  useEffect(() => {
    if(Object.keys(user_data).length > 0 && eSign_requests_you_signed_it.length === 0) {
      fetchData();
    }
  }, [user_data]);
  const columns = [
    {
      title: '#',
      width: '3%',
      render: (_, row) => eSign_requests_you_signed_it?.indexOf(row) + 1
    },{
      title: 'Subject',
      dataIndex: 'Title',
      width: '40%',
    },{
      title: 'Invitor',
      dataIndex: 'Status',
      width: '20%',
    },{
      title: 'Signed Date',
      dataIndex: 'Created',
      width: '25%',
      render: v => <div style={{minWidth: 170}}>{new Date(v).toLocaleString()}</div>
    },{
      title: 'Action',
      width: '12%',
      render: (_, row) => <a href={`https://salic-esign-dev.vercel.app/verify?key=${row.Key}`} target='_blank'>View</a>
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

    const url = `https://dev.salic.com/api/signature/AllRequests?Email=${user_data?.Data?.Mail}&${queryStr}`
    const response = await axios.get(url);
    setESignRequestsYouSignedIt(response.data?.Data);

    setFilterLoading(false);
  }



  if(loading) {
    <AntdLoader />
  }
  return (
    <div className='eSign-requests-container'>
      <div className='header'>
        <h1>eSign Documents You Signed it</h1>
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
          
          <Col span={24}>
            <Table
              columns={columns}
              dataSource={eSign_requests_you_signed_it} 
              pagination={{position: ['none', 'bottomCenter'], pageSize: 50, hideOnSinglePage: true }} 
            />
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default YouSignedIt