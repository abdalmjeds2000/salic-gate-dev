import React, { useContext, useRef, useState } from 'react';
import { Button, Col, Divider, Form, Input, message, Modal, notification, Row, Select, Space, Table, Typography } from 'antd';
import { FileTextOutlined, PlusOutlined } from '@ant-design/icons';
import DropdownSelectUser from '../../../../../../Global/DropdownSelectUser/DropdownSelectUser';
import axios from 'axios';
import { useEffect } from 'react';
import AntdLoader from '../../../../../../Global/AntdLoader/AntdLoader';
import { AppCtx } from '../../../../../../App';

const NewDeliveryLetter = () => {
  const { user_data } = useContext(AppCtx);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState([]);
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [assetsTo, setAssetsTo] = useState("");
  
  const [filterOptions, setFilterOptions] = useState({Category: 'All', Type: 'All', Brand: 'All', Tag: ''});
  const [filteredAssets, setFilteredAssets] = useState([]);
  
  const fetchAssets = () => {
    axios({
      method: 'GET',
      url: 'https://dev.salic.com/api/Asset/GetAssets'
    }).then((response) => {
      setAssets(response.data.Data);
    }).then(() => {
      setLoading(false);
    }).catch((err) => console.log(err))
  }
  useEffect(() => {
    fetchAssets();
  }, []);

  useEffect(() => {
    const data = assets?.filter(row => {
      if(
          (filterOptions.Category == row.CategoryType || filterOptions.Category === "All") && 
          (filterOptions.Type == row.Type || filterOptions.Type === "All") && 
          (filterOptions.Brand == row.Brand || filterOptions.Brand === "All") && 
          row.TagNumber.includes(filterOptions.Tag) 
        ) {
          return true;
        } 
        return false;
    })
    setFilteredAssets(data);
  }, [assets, filterOptions]);





  var types = new Set();
  var uniqueTypes = assets?.filter((m) => {
    if (types.has(m.Type)) {
      return false;
    }
    types.add(m.Type);
    return true;
  });
  var brands = new Set();
  var uniqueBrands = assets?.filter((m) => {
    if (brands.has(m.Brand)) {
      return false;
    }
    brands.add(m.Brand);
    return true;
  });
  var categories = new Set();
  var uniqueCategories = assets?.filter((m) => {
    if (categories.has(m.CategoryType)) {
      return false;
    }
    categories.add(m.CategoryType);
    return true;
  });



  
  const submitForm = async () => {
    const Assets = selectedAssets?.map(row => {
      var isNew = Number(row.Id) < 1;
      return {
        IsNew: isNew,
        Id: isNew ? "-1" : row.Id,
        Value: isNew ? row.Name : row.Id,
      }
    })
    if(Assets.length > 0 && assetsTo.length > 0) {
      const data = {
        Email: user_data.Data.Mail,
        ToUser: assetsTo,
        Assets: JSON.stringify(Assets)
      }
      axios({
        method: 'POST',
        url: 'https://dev.salic.com/api/Asset/NewDeliveryNote',
        data: data
      }).then((response) => {
        console.log(response);
        setFilterOptions({Category: 'All', Type: 'All', Brand: 'All', Tag: ''});
        setSelectedAssets([]);
        setAssetsTo('');
        notification.success({message: 'Success'})
      })
      .catch(() => message.error("Failed"));
    } else message.error('fill form correctly');
  }









  const [name, setName] = useState("");
  const inputRef = useRef(null);
  const onNameChange = (event) => {
    setName(event.target.value);
  };


  const addItem = (e) => {
    e.preventDefault();
    setFilteredAssets([{Id: (new Date().getTime() * -1).toString(), Name: name, SubDevices: "[]"}, ...filteredAssets]);
    setName('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };



  if(loading) return <AntdLoader />
  return (
    <>
      <Button type='primary' onClick={() => setOpenModal(true)}>New Delivery Letter</Button>
      <Modal
        title={<><FileTextOutlined /> New Delivery Letter</>}
        open={openModal}
        onCancel={() => setOpenModal(false)}
        className='more-width-antd-modal'
        okText="Submit"
        onOk={submitForm}
        destroyOnClose
      >
        {/* options */}
        <Form layout='vertical'>
          <Row gutter={[20, 20]}>
            <Col span={24}>
              <Row gutter={10}>
                <Col xs={24} md={12} lg={6}>
                  <Form.Item label="Category">
                    <Select 
                      defaultValue="All" 
                      size='large' 
                      options={[{value: 'All'}, ...uniqueCategories.map(e => { return {value: e.CategoryType} })]} 
                      onChange={v => setFilterOptions(prev => {prev.Category = v; return{...prev}})} 
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={6}>
                  <Form.Item label="Type">
                    <Select 
                      defaultValue="All" 
                      size='large' 
                      options={[{value: 'All'}, ...uniqueTypes.map(e => { return {value: e.Type} })]} 
                      onChange={v => setFilterOptions(prev => {prev.Type = v; return{...prev}})}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={6}>
                  <Form.Item label="Brand">
                    <Select 
                      defaultValue="All" 
                      size='large' 
                      options={[{value: 'All'}, ...uniqueBrands.map(e => { return {value: e.Brand} })]} 
                      onChange={v => setFilterOptions(prev => {prev.Brand = v; return{...prev}})}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={6}>
                  <Form.Item label="Tag Number">
                    <Input 
                      placeholder="write tag number" 
                      size='large'
                      value={filterOptions.Tag}
                      onChange={e => {
                        const value = e.target.value;
                        (async () => {await setFilterOptions(prev => {prev.Tag = value; return{...prev}})})()
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Form.Item label={`Availabe Assets ( ${filteredAssets.length} )`}>
                <Select
                  size='large' 
                  placeholder="Select Assets"
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <Divider
                        style={{
                          margin: '8px 0',
                        }}
                      />
                      <Space style={{ padding: '0 8px 4px' }} >
                        <Input
                          placeholder="type to add asset name"
                          ref={inputRef}
                          value={name}
                          onChange={onNameChange}
                        />
                        <Button type="text" icon={<PlusOutlined />} onClick={name.length >= 3 ? addItem : () => message.info("Asset name must be at least 3 character")}>
                          Add Asset
                        </Button>
                      </Space>
                    </>
                  )}
                  options={filteredAssets.map(row => {return {value: row.Id, label: row.Name}})}
                  onChange={(e) => {
                    if(selectedAssets.filter(row => row.Id == e).length === 0 || e == "-1") {
                      setSelectedAssets(prev => [...prev, ...filteredAssets.filter(row => row.Id === e)])
                    } else message.info("Already there!")
                  }} 
                />

              </Form.Item>
            </Col>
            {/* <Col span={24}>
              <Button 
                type='ghost'
                onClick={() => {}}
              >
                <PlusCircleOutlined /> Add New Asset
              </Button>
            </Col> */}
            <Col span={24}>
              <Table 
                columns={[
                  {title: '#', dataIndex: '', render: (_, record) => <span>{`${selectedAssets?.indexOf(record)+1}`}</span>, width: '5%'},
                  {
                    title: 'Item', 
                    dataIndex: 'Name', 
                    render: (val, record) => <>
                      <Typography.Title level={5}>{val}</Typography.Title>
                      {
                        record.SubDevices && record.SubDevices !== ""
                        ? (
                          JSON.parse(record.SubDevices)?.length > 0 && <Typography.Text style={{color: '#a4a4a4'}}>Related devices: <ol>{JSON.parse(record.SubDevices)?.map(row => <li>{row.name}</li>)}</ol></Typography.Text>
                        ) : (
                          null
                        )
                      }
                    </>, 
                    width: '80%'
                  },
                  {
                    title: 'Action', 
                    dataIndex: 'Id', 
                    render: (_, record) => <Typography.Link type='danger' onClick={() => setSelectedAssets(prev => prev.filter(row => row.Name != record.Name))}>Delete</Typography.Link>, width: '15%'
                  },
                ]} 
                dataSource={selectedAssets} 
                pagination={false} 
              />
            </Col>
            <Col span={24}>
              <Form.Item label="Deliver above assets to">
                <DropdownSelectUser
                  name="DeliveredTo"
                  onChange={value => setAssetsTo(value)}
                  placeholder="employee name"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  )
}

export default NewDeliveryLetter