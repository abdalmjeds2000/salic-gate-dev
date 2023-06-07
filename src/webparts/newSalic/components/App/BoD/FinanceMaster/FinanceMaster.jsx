import React, { useContext, useEffect, useRef, useState } from 'react';
import './FinanceMaster.css';
import { Collapse, Empty, Form, InputNumber, Table, message } from 'antd';
import { groupedData } from './util';
import CreateItem from './CreateItem';
import EditableDescriptionIndex from './EditableDescriptionIndex';
import pnp from 'sp-pnp-js';
import { roundedNum } from '../../Global/roundedNum';
import HistoryNavigation from '../../Global/HistoryNavigation/HistoryNavigation';
import { useNavigate } from 'react-router-dom';
import { AppCtx } from '../../App';
import useIsAdmin from '../../Hooks/useIsAdmin';
import AntdLoader from '../../Global/AntdLoader/AntdLoader';

function getMonthName(monthNumber) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  if (monthNumber >= 1 && monthNumber <= 12) {
    return monthNames[monthNumber - 1];
  } else {
    return monthNumber;
  }
}
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
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    if(['Change', 'Variance'].includes(dataIndex)) {
      form.setFieldsValue({ [dataIndex]: roundedNum(record[dataIndex] * 100) });
    } else {
      form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    }
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      if(values.Change) values.Change = roundedNum(values.Change / 100);
      if(values.Variance) values.Variance = roundedNum(values.Variance / 100);
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
      <Form.Item
        style={{ margin: 0, minHeight: 0 }}
        name={dataIndex}
        rules={[
          { required: true, message: '' },
        ]}
      >
        <InputNumber ref={inputRef} parser={(value) => roundedNum(value)} onPressEnter={save} size='small' onBlur={save} step={0.01} style={{ width: '100%' }} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};



const FinanceMaster = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState([]);
  const navigate = useNavigate();
  const { defualt_route } = useContext(AppCtx);
  const [isGroupUser] = useIsAdmin('BoD Investment Members');


  const fetchData = async () => {
    setLoading(true);
    const result = await pnp.sp.web.lists.getByTitle('FinanceMaster').items.top(5000).get();
    const d = result.sort((a, b) => a.DescriptionIndex - b.DescriptionIndex);
    setData(d);
    setDataSource(groupedData(d));
    setLoading(false);
  }
  useEffect(() => { fetchData(); }, []);

  const handleUpdateIndex = async (newValue, record) => {
    setLoading(true);
    const { parent, SubClassification, header } = record;
    const rows = data.filter(row => row.FType === parent && row.SubClassification === SubClassification && row.Description === header);
    const newData = [...data];
    for (const row of rows) {
      const payload = { DescriptionIndex: newValue };
      await pnp.sp.web.lists.getByTitle('FinanceMaster').items.getById(row.Id).update(payload);
      const index = newData.findIndex((item) => row.Id === item.Id);
      const item = newData[index];
      item.DescriptionIndex = newValue;
      newData.splice(index, 1, {
        ...item,
        ...row,
      });
    }
    newData.sort((a, b) => a.DescriptionIndex - b.DescriptionIndex);
    message.success('Index Updated Succefully!', 1);
    setData(newData);
    setDataSource(groupedData(newData));
    setLoading(false);
  }
  const defaultColumns = [
    {
      title: 'Title',
      dataIndex: 'header',
      width: '40%',
      render: (val, record) => (
        <div style={{ minWidth: 150, fontWeight: 500 }}>
          {record.groupBy === "Description" && <EditableDescriptionIndex value={record.DescriptionIndex} onFinish={newValue => handleUpdateIndex(newValue, record)} />}
          {record.level === 4 ? getMonthName(val) : val}
        </div>
      ),
      onCell: (record, index) => {
        return { colSpan: record.isEditable ? 1 : 7 };
      },
    },
    {
      title: 'Actual',
      dataIndex: 'Actual',
      editable: true,
      width: '12%',
      render: (val) => <div style={{ minWidth: 60 }}>{val}</div>
    },
    {
      title: 'Budget',
      dataIndex: 'Budget',
      editable: true,
      width: '12%',
      render: (val) => <div style={{ minWidth: 60 }}>{val}</div>
    },
    {
      title: 'Forcast',
      dataIndex: 'Forcast',
      editable: true,
      width: '12%',
      render: (val) => <div style={{ minWidth: 60 }}>{val}</div>
    },
    {
      title: '%Change',
      dataIndex: 'Change',
      editable: true,
      width: '12%',
      render: (val) => <div style={{ minWidth: 60 }}>{roundedNum(val*100)}%</div>
    },
    {
      title: '%Variance',
      dataIndex: 'Variance',
      editable: true,
      width: '12%',
      render: (val) => <div style={{ minWidth: 60 }}>{roundedNum(val*100)}%</div>
    },
    // {
    //   title: 'Action',
    //   width: '10%',
    //   onCell: (record, index) => {
    //     return {colSpan: record.isEditable ? 1 : 0} 
    //   },
    //   render: (_, record) =>
    //     dataSource.length >= 1 ? (
    //       <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
    //         <Button danger type='link'>Delete</Button>
    //       </Popconfirm>
    //     ) : null,
    // },
  ];
  const columns = defaultColumns.map((col) => {
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
        handleSave,
        colSpan: record.isEditable ? 1 : 0
      }),
    };
  });

  const handleSave = async (row) => {
    const newData = [...data];
    const index = newData.findIndex((item) => row.Id === item.Id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });

    if(
      row.Actual == item.Actual && 
      row.Budget == item.Budget && 
      row.Forcast == item.Forcast && 
      row.Change == item.Change && 
      row.Variance == item.Variance
    ) {
      console.log('No Changes');
    } else {
      const payload = {
        Actual: newData[index].Actual,
        Budget: newData[index].Budget,
        Forcast: newData[index].Forcast,
        Change: newData[index].Change,
        Variance: newData[index].Variance,
      };
      const updateResponse = await pnp.sp.web.lists.getByTitle('FinanceMaster').items.getById(item.Id).update(payload);
      message.success("The item has been modified successfully", 1);
    }
    setData(newData);
    setDataSource(groupedData(newData));
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const handleOnCreateItem = (row) => {
    const newData = [...data, row];
    setData(newData);
    setDataSource(groupedData(newData));
  }

  const dataTypesList = dataSource
    ?.map((r) => r.parent)
    ?.filter(function (item, pos, self) { return self.indexOf(item) == pos; })
    ?.sort();

  if(!isGroupUser) return (<AntdLoader />);

  return (
    <>
      <HistoryNavigation>
        <a onClick={() => navigate(defualt_route + '/bod')}>BoD</a>
        <p>Finance Master</p>
      </HistoryNavigation>

      <div className="finance-master-page-container">
        <Form form={form} component={false}>
          <div className="table-page-container">
            <div className="content">
              <div className="header">
                <h1>Finance Master</h1>
                <div>
                  <CreateItem onSuccess={handleOnCreateItem} data={data} dataSource={dataSource} />
                </div>
              </div>
              <div className="form">
                {dataSource.length > 0 ? <Collapse defaultActiveKey={["1"]}>
                  {dataTypesList.map((row, i) => (
                    <Collapse.Panel key={i + 1} header={`Type :: ${row}`}>
                      <div style={{ overflowX: "auto" }}>
                        <Table
                          components={components}
                          bordered
                          loading={loading}
                          dataSource={dataSource?.filter((r) => r.parent === row)}
                          columns={columns}
                          pagination={false}
                          // size="small"
                          rowClassName={(record) => {
                              let className = 'editable-row';
                              if(!record.isEditable) className += ' finance-master-row-header'
                              className += ` lvl-${record.level}`
                            return className;
                          }}
                        />
                      </div>
                    </Collapse.Panel>
                  ))}
                </Collapse> : <AntdLoader />}
                {(!loading && dataSource.length === 0) ? <Empty /> : null}
              </div>
            </div>
          </div>
        </Form>
      </div>
    </>
  )
}

export default FinanceMaster