import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppCtx } from '../../App';
import useIsAdmin from '../../Hooks/useIsAdmin';
import { Button, Form, Input, InputNumber, Popconfirm, Space, Table, message } from 'antd';
import HistoryNavigation from '../../Global/HistoryNavigation/HistoryNavigation';
import ContributionCreateItem from './ContributionCreateItem';
import AntdLoader from '../../Global/AntdLoader/AntdLoader';
import { RedoOutlined } from '@ant-design/icons';
import pnp from 'sp-pnp-js';





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




const Contribution = () => {
  const navigate = useNavigate();
  const { defualt_route } = useContext(AppCtx);
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState([]);
  const [isGroupUser] = useIsAdmin('BoD Committee Members');

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await pnp.sp.web.lists.getByTitle('BoD Contribution').items.get();
      setData(response);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);


  const renderTD = (value, minWidth) => <div style={{ minWidth }}>{value}</div>;
  const columns = [
    { 
      title: 'Commodity',
      dataIndex: 'Commodity', 
      editable: true,
      width: '15%',
      render: value => renderTD(value, 140),
    },
    { 
      title: 'Commodity Type', 
      dataIndex: 'CommodityType', 
      editable: true,
      width: '15%',
      render: value => renderTD(value, 90),
    },
    { 
      title: 'Year 2022', 
      dataIndex: 'Year2022', 
      editable: true,
      width: '15%',
      render: value => renderTD(value, 90),
    },
    { 
      title: 'Year 2023', 
      dataIndex: 'Year2023', 
      editable: true,
      width: '15%',
      render: value => renderTD(value, 90),
    },
    { 
      title: 'Portfolio Company', 
      dataIndex: 'PortfolioCompany', 
      editable: true,
      width: '15%',
      render: value => renderTD(value, 90),
    },
    { 
      title: 'Comments', 
      dataIndex: 'Comments', 
      editable: true,
      width: '15%',
      render: value => renderTD(value, 90),
    },
    {
      title: 'Action',
      dataIndex: 'operation',
      width: '10%',
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
      await pnp.sp.web.lists.getByTitle('BoD Contribution').items.getById(id).delete();
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
      Commodity: row.Commodity,
      CommodityType: row.CommodityType,
      Year2022: row.Year2022,
      Year2023: row.Year2023,
      PortfolioCompany: row.PortfolioCompany,
      Comments: row.Comments,
    };
    try {
      await pnp.sp.web.lists.getByTitle('BoD Contribution').items.getById(item.Id).update(payload);
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
        inputType: col.dataIndex === 'Comments' ? 'textarea' : ['Year2022', 'Year2023'].includes(col.dataIndex) ? 'number' : 'text',
        handleSave,
      }),
    };
  });

  const ControlPanel = (
    <Space size={5}>
      <Button size='small' loading={loading} icon={<RedoOutlined />} onClick={fetchData}>Refresh</Button>
      <ContributionCreateItem onFinish={newvalue => setData(prev => [...prev, newvalue])} />
    </Space>
  );


  if(!isGroupUser) return (<AntdLoader />);
  return (
    <>
      <HistoryNavigation>
        <a onClick={() => navigate(defualt_route + '/bod')}>BoD</a>
        <p>Contribution</p>
      </HistoryNavigation>
    

      <div className="table-page-container">
        <div className='content'>
          <div className="header">
            <h1>Contribution</h1>
            <div>{ControlPanel}</div>
          </div>

          <div className='form' style={{padding: '10px'}}>
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
    </>
  )
}

export default Contribution