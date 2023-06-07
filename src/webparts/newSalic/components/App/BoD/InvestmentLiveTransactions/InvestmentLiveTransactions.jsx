import React, { useContext, useRef, useState } from 'react';
import HistoryNavigation from '../../Global/HistoryNavigation/HistoryNavigation';
import { useNavigate } from 'react-router-dom';
import { AppCtx } from '../../App';
import AntdLoader from '../../Global/AntdLoader/AntdLoader';
import useIsAdmin from '../../Hooks/useIsAdmin';
import pnp from 'sp-pnp-js';
import { useEffect } from 'react';
import { Button, Form, Input, InputNumber, Popconfirm, Space, Table, message } from 'antd';
import { FundProjectionScreenOutlined, RedoOutlined, SearchOutlined, TableOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import Tabs from '../../Global/CustomTabs/Tabs';
import InvestmentLiveTransactionsCreateItem from './InvestmentLiveTransactionsCreateItem';
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
            <Input.TextArea ref={inputRef} placeholder='write here' rows={2} style={{ minWidth: 100 }} onPressEnter={save} onBlur={save} />
          : inputType === 'number' ?
            <InputNumber ref={inputRef} placeholder='enter a number' step={1} style={{ minWidth: 100 }} onPressEnter={save} onBlur={save} />
          :
            <Input ref={inputRef} placeholder='write here' style={{ minWidth: 100 }} onPressEnter={save} onBlur={save} />
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

const InvestmentLiveTransactions = () => {
  const navigate = useNavigate();
  const { defualt_route } = useContext(AppCtx);
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState([]);
  const [isGroupUser] = useIsAdmin('BoD Investment Members');
  const [link, setLink] = React.useState(null);
  const [isSnapshotsAdmin] = useIsAdmin("BoD Snapshots Admins");
  
  const fetchLink = async () => {
    try {
      const response = await pnp.sp.web.lists.getByTitle('BoD Snapshots Links').items.filter("Title eq 'Investment Live Transactions'").get();
      setLink(response[0]);
    } catch (error) {
      console.log(error);
    }
  }
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await pnp.sp.web.lists.getByTitle('BoD Investment Live Transactions').items.get();
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
      title: 'Type', 
      dataIndex: 'Type_', 
      editable: true,
      render: value => renderTD(value, 'Type_', 120),
      ...getColumnSearchProps('Type_'),
    },
    { 
      title: 'Project Name', 
      dataIndex: 'ProjectName', 
      editable: true,
      render: value => renderTD(value, 'ProjectName', 130),
      ...getColumnSearchProps('ProjectName'),
    },
    { 
      title: 'Target', 
      dataIndex: 'Target', 
      editable: true,
      render: value => renderTD(value, 'Target', 100),
      ...getColumnSearchProps('Target'),
    },
    { 
      title: 'Commodity', 
      dataIndex: 'Commodity', 
      editable: true,
      render: value => renderTD(value, 'Commodity', 120),
      ...getColumnSearchProps('Commodity'),
    },
    { 
      title: 'Country', 
      dataIndex: 'Country', 
      editable: true,
      render: value => renderTD(value, 'Country', 100),
      ...getColumnSearchProps('Country'),
    },
    { 
      title: 'Stake', 
      dataIndex: 'Stake', 
      editable: true,
      render: value => renderTD(value, 'Stake', 80),
      ...getColumnSearchProps('Stake'),
    },
    { 
      title: 'SALIC Coverage (Tons)', 
      dataIndex: 'SALICCoverage', 
      editable: true,
      render: value => renderTD(value, 'SALICCoverage',  80),
      ...getColumnSearchProps('SALICCoverage'),
    },
    { 
      title: 'Contribution', 
      dataIndex: 'Contribution', 
      editable: true,
      render: value => renderTD(value, 'Contribution', 80),
      ...getColumnSearchProps('Contribution'),
    },
    { 
      title: 'Consideration', 
      dataIndex: 'Consideration', 
      editable: true,
      render: value => renderTD(value, 'Consideration', 140),
      ...getColumnSearchProps('Consideration'),
    },
    { 
      title: 'Status', 
      dataIndex: 'Status', 
      editable: true,
      render: value => renderTD(value, 'Status', 100),
      ...getColumnSearchProps('Status'),
    },
    { 
      title: 'Commodity Coverage', 
      dataIndex: 'CommodityCoverage', 
      editable: true,
      render: value => renderTD(value, 'CommodityCoverage', 140),
      ...getColumnSearchProps('CommodityCoverage'),
    },
    { 
      title: 'Comments', 
      dataIndex: 'Comments', 
      editable: true,
      render: value => renderTD(value, 'Comments', 150),
      ...getColumnSearchProps('Comments'),
    },
    { 
      title: 'Next Steps', 
      dataIndex: 'NextSteps', 
      editable: true,
      render: value => renderTD(value, 'NextSteps', 150),
      ...getColumnSearchProps('NextSteps'),
    },
    { 
      title: 'Deal Size (US$ mm)', 
      dataIndex: 'DealSize_x0028_US_x0024_mm_x0029', 
      editable: true,
      render: value => renderTD(value, 'DealSize_x0028_US_x0024_mm_x0029', 100),
      ...getColumnSearchProps('DealSize_x0028_US_x0024_mm_x0029'),
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
      await pnp.sp.web.lists.getByTitle('BoD Investment Live Transactions').items.getById(id).delete();
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
      Type_: row.Type_, 
      ProjectName: row.ProjectName,
      Target: row.Target,
      Commodity: row.Commodity,
      Country: row.Country,
      Stake: row.Stake,
      SALICCoverage: row.SALICCoverage,
      Contribution: row.Contribution,
      Consideration: row.Consideration,
      Status: row.Status,
      CommodityCoverage: row.CommodityCoverage,
      Comments: row.Comments,
      NextSteps: row.NextSteps,
      DealSize_x0028_US_x0024_mm_x0029: row.DealSize_x0028_US_x0024_mm_x0029,
    };
    try {
      await pnp.sp.web.lists.getByTitle('BoD Investment Live Transactions').items.getById(item.Id).update(payload);
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
        inputType: ['Commodity', 'Country', 'Comments', 'NextSteps'].includes(col.dataIndex) ? 'textarea' : ['SALICCoverage', 'Contribution', 'DealSize_x0028_US_x0024_mm_x0029'].includes(col.dataIndex) ? 'number' : 'text',
        handleSave,
      }),
    };
  });

  // const handleSnapShot = async () => {
  //   setLoading(true);
  //   const response = await pnp.sp.web.lists.getByTitle('BoD Investment Live Transactions').items.get();
  //   /* data with version_ equel 0 */
  //   const data = response.filter(item => item.version_ == 0);
  //   /* max version number from response */
  //   const maxVersion = Math.max(...response.map(item => item.version_));
  //   /* new instanse from data , but with new version */
  //   const newData = data.map(item => {
  //     /* remove sharepoint props like Id etc */
  //     const item_ = {
  //       Type_: item.Type_,
  //       ProjectName: item.ProjectName,
  //       Target: item.Target,
  //       Commodity: item.Commodity,
  //       Country: item.Country,
  //       Stake: item.Stake,
  //       SALICCoverage: item.SALICCoverage,
  //       Contribution: item.Contribution,
  //       Consideration: item.Consideration,
  //       Status: item.Status,
  //       CommodityCoverage: item.CommodityCoverage,
  //       Comments: item.Comments,
  //       NextSteps: item.NextSteps,
  //       DealSize_x0028_US_x0024_mm_x0029: item.DealSize_x0028_US_x0024_mm_x0029,
  //       version_: maxVersion + 1
  //     }
  //     return item_;
  //   });
  //   /* loop on newData and create items to sharepoint list by for loop */
  //   for(let i = 0; i < newData.length; i++) {
  //     await pnp.sp.web.lists.getByTitle('BoD Investment Live Transactions').items.add(newData[i]);
  //   }
  //   notification.success({
  //     message: 'Snapshot',
  //     description: 'Snapshot created successfully',
  //     duration: 2
  //   });
  //   setLoading(false);
  // };



  const ControlPanel = (
    <Space size={5}>
      <Button size='small' loading={loading} icon={<RedoOutlined />} onClick={fetchData}>Refresh</Button>
      <InvestmentLiveTransactionsCreateItem onFinish={newvalue => setData(prev => [...prev, newvalue])} />
      {/* <Popconfirm title="You need to confirm!" onConfirm={handleSnapShot} okButtonProps={{ className: 'ant-btn-warning', loading: loading }}>
        <Button type="primary" size='small' className='ant-btn-warning' icon={<CloudUploadOutlined />} loading={loading}>Snapshot</Button>
      </Popconfirm> */}
    </Space>
  );

  const investmentLiveTransactions = (
    <div className="table-page-container" style={{top: 0, marginBottom: 25, padding: 0, minHeight: 'fit-content'}}>
      <div className='content'>
        <div className="header" style={{borderRadius: 0}}>
          <h1>Investment Live Transactions</h1>
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
      key: 'investment_live_transactions_data', 
      icon: <TableOutlined />, 
      title: 'Investment Live Transactions', 
      content: investmentLiveTransactions
    },{
      key: "snapshot", 
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
        <p>Investment Live Transactions</p>
      </HistoryNavigation>

      <div className='standard-page'>
        <Tabs 
          items={tabsItems} 
          rightOfTabs={isSnapshotsAdmin && <ManageSnapshotsLinks defaultPage='Investment Live Transactions' onUpdate={fetchLink} />}
        />
      </div>
    </>
  )
}

export default InvestmentLiveTransactions