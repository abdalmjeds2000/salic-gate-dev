import React, { useContext, useRef, useState } from 'react';
import HistoryNavigation from '../../Global/HistoryNavigation/HistoryNavigation';
import { useNavigate } from 'react-router-dom';
import { AppCtx } from '../../App';
import AntdLoader from '../../Global/AntdLoader/AntdLoader';
import useIsAdmin from '../../Hooks/useIsAdmin';
import pnp from 'sp-pnp-js';
import { useEffect } from 'react';
import { Button, Form, Input, Popconfirm, Space, Table, message } from 'antd';
import { FundProjectionScreenOutlined, RedoOutlined, SearchOutlined, TableOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import Tabs from '../../Global/CustomTabs/Tabs';
import InvestmentPipelineCreateItem from './InvestmentPipelineCreateItem';
import ManageSnapshotsLinks from '../ManageSnapshotsLinks';


const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
const EditableCell = ({ title, editable, children, dataIndex, inputType, record, handleSave, ...restProps }) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) inputRef.current.focus();
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item style={{ margin: 0 }} name={dataIndex}>
        {
          inputType === 'textarea' ?
            <Input.TextArea ref={inputRef} rows={2} style={{ minWidth: 100 }} onPressEnter={save} onBlur={save} />
            :
            <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        }
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};




const InvestementPipeline = () => {
  const navigate = useNavigate();
  const { defualt_route } = useContext(AppCtx);
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState([]);
  const [isGroupUser] = useIsAdmin('BoD Investment Members');
  const [link, setLink] = React.useState(null);
  const [isSnapshotsAdmin] = useIsAdmin("BoD Snapshots Admins");

  const fetchLink = async () => {
    try {
      const response = await pnp.sp.web.lists.getByTitle('BoD Snapshots Links').items.filter("Title eq 'Investment Pipeline'").get();
      setLink(response[0]);
    } catch (error) {
      console.log(error);
    }
  }
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await pnp.sp.web.lists.getByTitle('BoD Investement Pipeline').items.get();
      setData(response);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
    fetchLink();
  }, []);



  const [searchText, setSearchText] = React.useState('');
  const [searchedColumn, setSearchedColumn] = React.useState('');
  const searchInput = React.useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder="Type to search"
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button type="primary" onClick={() => handleSearch(selectedKeys, confirm, dataIndex)} icon={<SearchOutlined />} size="small" style={{width: 90}}>
            Search
          </Button>
          <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button type="link" size="small" onClick={() => close()}>close</Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]?.toString()?.toLowerCase()?.includes(value?.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    }
  });

  const renderTD = (value, dataIndex, minWidth) => {
    return (
      <div style={{ minWidth }}>
        {searchedColumn === dataIndex ? (
          <Highlighter 
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={value ? value?.toString() : ''}
          />
        ) : value}
      </div>
    )
  };
  const columns = [
    { 
      title: 'Project Name', 
      dataIndex: 'ProjectName', 
      editable: true,
      render: value => renderTD(value, 'ProjectName', 140),
      ...getColumnSearchProps('ProjectName'),
    },
    { 
      title: 'Platform', 
      dataIndex: 'Platform', 
      editable: true,
      render: value => renderTD(value, 'Platform', 90),
      ...getColumnSearchProps('Platform'),
    },
    { 
      title: 'Commodity', 
      dataIndex: 'Commodity', 
      editable: true,
      render: value => renderTD(value, 'Commodity', 100),
      ...getColumnSearchProps('Commodity'),
    },
    { 
      title: 'Country', 
      dataIndex: 'Country', 
      editable: true,
      render: value => renderTD(value, 'Country', 80),
      ...getColumnSearchProps('Country'),
    },
    { 
      title: 'Deal Size', 
      dataIndex: 'DealSize', 
      editable: true,
      render: value => renderTD(value, 'DealSize', 100),
      ...getColumnSearchProps('DealSize'),
    },
    { 
      title: 'SALIC Own', 
      dataIndex: 'SALICOwn', 
      editable: true,
      render: value => renderTD(value, 'SALICOwn', 130),
      ...getColumnSearchProps('SALICOwn'),
    },
    { 
      title: 'Stake Range', 
      dataIndex: 'StakeRange', 
      editable: true,
      render: value => renderTD(value, 'StakeRange',  90),
      ...getColumnSearchProps('StakeRange'),
    },
    { 
      title: 'Completion Date', 
      dataIndex: 'CompletionDate', 
      editable: true,
      render: value => renderTD(value, 'CompletionDate', 150),
      ...getColumnSearchProps('CompletionDate'),
    },
    { 
      title: 'Stage', 
      dataIndex: 'Stage', 
      editable: true,
      render: value => renderTD(value, 'Stage', 60),
      ...getColumnSearchProps('Stage'),
    },
    { 
      title: 'Status', 
      dataIndex: 'Status', 
      editable: true,
      render: value => renderTD(value, 'Status', 60),
      ...getColumnSearchProps('Status'),
    },
    { 
      title: 'Commodity Coverage', 
      dataIndex: 'CommodityCoverage', 
      editable: true,
      render: value => renderTD(value, 'CommodityCoverage', 175),
      ...getColumnSearchProps('CommodityCoverage'),
    },
    { 
      title: 'Recent Discussions', 
      dataIndex: 'RecentDiscussions', 
      editable: true,
      render: value => renderTD(value, 'RecentDiscussions', 175),
      ...getColumnSearchProps('RecentDiscussions'),
    },
    { 
      title: 'Next Steps', 
      dataIndex: 'NextSteps', 
      editable: true,
      render: value => renderTD(value, 'NextSteps', 175),
      ...getColumnSearchProps('NextSteps'),
    },
    { 
      title: 'Sign-off status', 
      dataIndex: 'Sign_x002d_offstatus', 
      editable: true,
      render: value => renderTD(value, 'Sign_x002d_offstatus', 125),
      ...getColumnSearchProps('Sign_x002d_offstatus'),
    },
    {
      title: 'Action',
      dataIndex: 'operation',
      render: (_, record) =>
        data.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.Id)}>
            <Button type='link' danger>Delete</Button>
          </Popconfirm>
        ) : null,
    },
  ];

  const handleDelete = async (id) => {
    try {
      await pnp.sp.web.lists.getByTitle('BoD Investement Pipeline').items.getById(id).delete();
      message.success('Deleted Successfully');
    } catch (error) {
      console.log(error);
    }
    const newData = data?.filter((item) => item.Id !== id);
    setData(newData);
  };
  const handleSave = async (row) => {
    const newData = [...data];
    const index = newData.findIndex((item) => row.Id === item.Id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    if (JSON.stringify(item) === JSON.stringify(row)) return;
    const payload = {
      ProjectName: row.ProjectName, 
      Platform: row.Platform,
      Commodity: row.Commodity,
      Country: row.Country,
      DealSize: row.DealSize,
      SALICOwn: row.SALICOwn,
      StakeRange: row.StakeRange,
      CompletionDate: row.CompletionDate,
      Stage: row.Stage,
      Status: row.Status,
      CommodityCoverage: row.CommodityCoverage,
      RecentDiscussions: row.RecentDiscussions,
      NextSteps: row.NextSteps,
      Sign_x002d_offstatus: row.Sign_x002d_offstatus,
    };
    try {
      await pnp.sp.web.lists.getByTitle('BoD Investement Pipeline').items.getById(item.Id).update(payload);
      message.success('Updated Successfully');
    } catch (error) {
      console.log(error);
    }
    setData(newData);
  };
  const editableColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        inputType: ['Commodity', 'Country', 'CommodityCoverage', 'RecentDiscussions', 'NextSteps', 'StakeRange'].includes(col.dataIndex) ? 'textarea' : 'text',
        handleSave,
      }),
    };
  });


  const ControlPanel = (
    <Space size={5}>
      <Button size='small' loading={loading} icon={<RedoOutlined />} onClick={fetchData}>Refresh</Button>
      <InvestmentPipelineCreateItem onFinish={newvalue => setData(prev => [...prev, newvalue])} />
      {/* <Popconfirm title="You need to confirm!" onConfirm={handleSnapShot} okButtonProps={{ className: 'ant-btn-warning', loading: loading }}>
        <Button type="primary" size='small' className='ant-btn-warning' icon={<CloudUploadOutlined />} loading={loading}>Snapshot</Button>
      </Popconfirm> */}
    </Space>
  );



  const investementPipeline = (
    <div className="table-page-container" style={{top: 0, marginBottom: 25, padding: 0, minHeight: 'fit-content'}}>
      <div className='content'>
        <div className="header" style={{borderRadius: 0}}>
          <h1>Investement Pipeline</h1>
          <div>{ControlPanel}</div>
        </div>

        <div className='form' style={{padding: '10px 0'}}>
          <Table
            columns={editableColumns}
            dataSource={data}
            pagination={{position: ['none', 'bottomCenter'], pageSize: 50, hideOnSinglePage: true, style: {padding: '25px 0'} }} 
            loading={loading}
            components={{ body: { row: EditableRow, cell: EditableCell } }}
            size="large" bordered
            rowClassName={() => 'editable-row'}
          />
        </div>
      </div>
    </div>
  );

  const tabsItems = [
    {
      key: 'investement_data', 
      icon: <TableOutlined />, 
      title: 'Investement Pipeline', 
      content: investementPipeline
    },{
      key: 'snapshot', 
      icon: <FundProjectionScreenOutlined />, 
      title: "Snapshot", 
      content: (
        <iframe
          name="reportFrame"
          src={link?.Link}
          width="100%"
          style={{ border: 0, minHeight: "calc(100vh - 215px)" }}
        />
      ),
    },
  ];



  if(!isGroupUser) return (<AntdLoader />);
  return (
    <>
      <HistoryNavigation>
        <a onClick={() => navigate(defualt_route + '/bod')}>BoD</a>
        <p>Investement Pipeline</p>
      </HistoryNavigation>
      
      <div className='standard-page'>
        <Tabs 
          items={tabsItems}
          rightOfTabs={isSnapshotsAdmin && <ManageSnapshotsLinks defaultPage='Investment Pipeline' onUpdate={fetchLink} />}
        />
      </div>
    </>
  )
}

export default InvestementPipeline