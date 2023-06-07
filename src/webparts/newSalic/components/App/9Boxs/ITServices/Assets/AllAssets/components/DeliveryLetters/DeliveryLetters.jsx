import React, { useContext, useEffect, useState } from 'react';
import { Table, Row, Col, Typography, Form, Input, Select, Button, message, Pagination } from 'antd';
import axios from 'axios';
import { AppCtx } from '../../../../../../App';
import moment from 'moment';
import UserColumnInTable from '../../../../../../Global/UserColumnInTable/UserColumnInTable';
import DropdownSelectUser from '../../../../../../Global/DropdownSelectUser/DropdownSelectUser';
import { FilterOutlined } from '@ant-design/icons';
import Preview from './Preview';
import NewDeliveryLetter from './NewDeliveryLetter';
import AntdLoader from '../../../../../../Global/AntdLoader/AntdLoader';


const initialFilter = { email: '', Number: '', Department: 'All', Status: 'All', AssetName: '' };

const DeliveryLetters = () => {
  const { user_data, salic_departments, deliveryLettersData, setDeliveryLettersData } = useContext(AppCtx);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const _pageSize = 20;
  const [defualtFilterData, setDefualtFilterData] = useState(initialFilter);
  const [showFilterPanel, setShowFilterPanel] = useState(false);


  const FetchData = (filterData, page, pageSize) => {
    const skipItems = pageSize * (page - 1);
    const takeItems = pageSize;
    setLoading(true);
    axios({
      method: 'GET',
      url: `https://dev.salic.com/api/Asset/GetDeliveryNotes?draw=8&order=CreatedAt+desc&start=${skipItems}&length=${takeItems}&search[value]=&search[regex]=false&email=${filterData.email}&Number=${filterData.Number}&Department=${filterData.Department}&Status=${filterData.Status}&AssetName=${filterData.AssetName}&_=1669282863275`,
    }).then((response) => {
      setDeliveryLettersData(response.data);
    }).catch((err) => {
      message.error('Failed, check your network and try again.', 3)
    })
    setCurrentPage(page);
    setLoading(false);
  }

  useEffect(() => {
    if(Object.keys(user_data).length > 0 && salic_departments.length > 0) {
      FetchData(defualtFilterData, 1, _pageSize);
    }
  }, [user_data, salic_departments]);

  const ApplyFilter = (formData, page, pageSize) => {
    Object.keys(formData).forEach(key => {if(formData[key] === undefined || formData[key] === null) formData[key] = ''});
    FetchData(formData, page, pageSize);
  }

  const columns = [
    {
      title: 'DN#',
      dataIndex: 'Number',
      width: '7%',
    },{
      title: 'Date',
      dataIndex: 'CreatedAt',
      width: '10%',
      render: (date) => date ? <div style={{minWidth: 120}}>{moment(date).format('MM/DD/YYYY hh:mm')}</div> : ''
    },{
      title: 'Delivered To',
      dataIndex: 'DeliveredTo',
      width: '22%',
      render: (val) => <div style={{minWidth: 120}}><UserColumnInTable Mail={val?.Mail} DisplayName={val?.DisplayName} /></div>
    },{
      title: 'Delivered By',
      dataIndex: 'Requester',
      width: '22%',
      render: (val) => <div style={{minWidth: 120}}><UserColumnInTable Mail={val?.Mail} DisplayName={val?.DisplayName} /></div>
    },{
      title: 'Status',
      dataIndex: 'Status',
      width: '10%',
      render: (val) => val == "Submitted_By_IT" ? "Pending" : "Acknowleged"
    },{
      title: 'Assets Count',
      dataIndex: 'DeliveryNoteDetailCount',
      width: '10%',
    },{
      title: 'Preview',
      dataIndex: 'Id',
      width: '10%',
      render: (id) => <Preview id={id} />
    }
  ];

  let departments = [];
  if(salic_departments.length > 0) {
    departments = salic_departments?.map(row => {
      return { value: row, label: row }
    })
  }
  
  return (
    <Row gutter={[25, 25]}>
      <Col span={24}>
        <Form 
          form={form} 
          onFinish={(values) => {
            if(showFilterPanel) {
              ApplyFilter(values, 1, _pageSize); 
              setDefualtFilterData(values);
            }
          }} 
          layout="vertical" 
          onReset={() => {FetchData(initialFilter, 1, _pageSize); showFilterPanel ? setShowFilterPanel(false) : null}}
        >
          <Row gutter={[15, 0]}>
            {
              showFilterPanel && 
              <>
                <Col xs={24} md={12} lg={6}>
                  <Form.Item name="Number" label="Delivery Letter Number">
                    <Input placeholder="write here" size='large' />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={6}>
                  <Form.Item name="Department" label="Department" initialValue="All">
                    <Select 
                      defaultValue="All" 
                      size='large' 
                      options={[{value: 'All', label: 'All'}, ...departments]} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={6}>
                  <Form.Item name="Status" label="Status" initialValue="All">
                    <Select 
                      defaultValue="All" 
                      size='large' 
                      options={[
                        {value: 'All', label: 'All'}, 
                        {value: 'Submitted_By_IT', label: 'Pending'}, 
                        {value: 'Acknowledged_By_User', label: 'Acknowledged'}, 
                      ]} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={6}>
                  <Form.Item name="AssetName" label="Asset Name">
                    <Input placeholder="write here" size='large' />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={6}>
                  <Form.Item label="Email Address">
                    <DropdownSelectUser
                      name="email"
                      placeholder="employee name"
                    />
                  </Form.Item>
                </Col>
              </>
            }
            
            <Col span={24}>
              <Row align="middle" justify="end">
                  <Button type="primary" onClick={() => !showFilterPanel ? setShowFilterPanel(true) : null} icon={<FilterOutlined />} loading={loading} htmlType={showFilterPanel ? "submit" : "button"} style={{marginRight: 10}}>
                    Filter
                  </Button>
                  {showFilterPanel && <Button htmlType="reset" danger style={{marginRight: 25}}>
                    Reset
                  </Button>}
                <NewDeliveryLetter />
              </Row>
            </Col>
          </Row>
        </Form>
      </Col>

      {
        !loading
        ? (
          <>
            <Col span={24} style={{overflow: 'auto'}}>
              <Table columns={columns} size="large" dataSource={deliveryLettersData?.data} pagination={false} />
            </Col>

            <Row justify="center" align="middle" style={{width: '100%', marginTop: 25}}>
              <Pagination
                current={currentPage}
                total={deliveryLettersData?.recordsTotal}
                onChange={(page) => ApplyFilter(defualtFilterData, page, _pageSize)}
                pageSize={_pageSize}
                showTitle
              />
            </Row>
          </>
        ) : (
          <AntdLoader />
        )
      }
    </Row>
  )
}

export default DeliveryLetters