import React, { useContext, useEffect, useRef, useState } from 'react';
import './KeyFinancialMetrics.css';
import { Collapse, Empty, Form, InputNumber, Table, message } from 'antd';
import { groupedData } from './util';
import CreateItem from './CreateItem';
import pnp from 'sp-pnp-js';
import { roundedNum } from '../../Global/roundedNum';
import HistoryNavigation from '../../Global/HistoryNavigation/HistoryNavigation';
import { useNavigate } from 'react-router-dom';
import { AppCtx } from '../../App';
import AntdLoader from '../../Global/AntdLoader/AntdLoader';
import useIsAdmin from '../../Hooks/useIsAdmin';

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



const KeyFinancialMetrics = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState([]);
  const navigate = useNavigate();
  const { defualt_route } = useContext(AppCtx);
  const [isGroupUser] = useIsAdmin('BoD Investment Members');


  const fetchData = async () => {
    setLoading(true);
    const result = await pnp.sp.web.lists.getByTitle('KeyFinancialMetrics').items.top(5000).get();
    setData(result);
    setDataSource(groupedData(result));
    setLoading(false);
  }
  useEffect(() => { fetchData(); }, []);

  const defaultColumns = [
    {
      title: 'Title',
      dataIndex: 'header',
      width: '50%',
      render: (val, record) => (
        <div style={{ minWidth: 150, fontWeight: 500, fontSize: record.level === 1 ? '1.15rem' : '1rem' }}>
          {record.level === 3 ? getMonthName(val) : val}
        </div>
      ),
      onCell: (record, index) => {
        return { colSpan: record.isEditable ? 1 : 3 };
      },
    },
    {
      title: 'Actual',
      dataIndex: 'Actual',
      editable: true,
      width: '25%',
      render: (val) => <div style={{ minWidth: 100 }}>{val}</div>
    },
    {
      title: 'Budget',
      dataIndex: 'Budget',
      editable: true,
      width: '25%',
      render: (val) => <div style={{ minWidth: 100 }}>{val}</div>
    },
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
      row.Budget == item.Budget
    ) {
      console.log('No Changes');
    } else {
      const payload = {
        Actual: newData[index].Actual,
        Budget: newData[index].Budget,
      };
      const updateResponse = await pnp.sp.web.lists.getByTitle('KeyFinancialMetrics').items.getById(item.Id).update(payload);
      console.log('updateResponse', updateResponse);
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

  if(!isGroupUser) return (<AntdLoader />);

  return (
    <>
      <HistoryNavigation>
        <a onClick={() => navigate(defualt_route + '/bod')}>BoD</a>
        <p>Key Financial Metrics</p>
      </HistoryNavigation>

      <div className="key-financial-metrics-page-container">
        <Form form={form} component={false}>
          <div className="table-page-container">
            <div className="content">
              <div className="header">
                <h1>Key Financial Metrics</h1>
                <div>
                  <CreateItem onSuccess={handleOnCreateItem} dataSource={dataSource} />
                </div>
              </div>
              <div className="form">
                {
                (!loading && dataSource.length > 0) 
                ? (
                    <Collapse defaultActiveKey={["1"]}>
                      {dataTypesList?.map((row, i) => (
                        <Collapse.Panel key={i + 1} header={`Key Financial Ratio :: ${row}`}>
                          <div style={{ overflowX: "auto" }}>
                            <Table
                              components={components}
                              bordered
                              dataSource={dataSource?.filter((r) => r.parent === row)}
                              columns={columns}
                              pagination={false}
                              rowClassName={(record) => `editable-row key-financial-metrics-row-header lvl-${record.level}`}
                            />
                          </div>
                        </Collapse.Panel>
                      ))}
                    </Collapse>
                  ) : (
                    loading
                  )
                }
                {(!loading && dataSource.length === 0) ? <Empty /> : null}
                {loading && <AntdLoader />}
              </div>
            </div>
          </div>
        </Form>
      </div>
    </>
  )
}

export default KeyFinancialMetrics