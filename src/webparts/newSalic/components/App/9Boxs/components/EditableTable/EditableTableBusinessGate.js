import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Checkbox, Form, Input, message, Popconfirm, Table } from 'antd';
import parse from 'html-react-parser';



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
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      // console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: dataIndex === 'Name' ? true : false,
          },
        ]}
      >
        <Input ref={inputRef} placeholder={dataIndex} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};



const EditableTable = (props) => {

  const [count, setCount] = useState(1);
  const handleDelete = (key) => {
    const newData = props.dataSource.length === 1 ? props.dataSource : props.dataSource?.filter((item) => item.key != key);
    props.setDataSource(newData);
  };
  const defaultColumns = [
    {
      title: () => <>Guest Name <span style={{color: 'red'}}>*</span></>,
      dataIndex: 'Name',
      editable: props.PreviewMode ? false : true,
      render: (val) => props.PreviewMode ? parse(val) : val
    },{
      title: 'Guest Email',
      dataIndex: 'Email',
      editable: props.PreviewMode ? false : true,
      render: (val) => props.PreviewMode ? parse(val) : val
    },{
      title: 'Mobile Number',
      dataIndex: 'Mobile',
      editable: props.PreviewMode ? false : true,
      render: (val) => props.PreviewMode ? parse(val) : val
    },{
      title: 'Company',
      dataIndex: 'Company',
      editable: props.PreviewMode ? false : true,
      render: (val) => props.PreviewMode ? parse(val) : val
    },{
      title: 'With Car',
      dataIndex: 'Car',
      render: (val, record) => {
        return <Checkbox 
          checked={val}
          disabled={props.PreviewMode ? true : false}
          onChange={e => {
            record.Car = e.target.checked
            props.setDataSource([...props.dataSource])
          }}
        ></Checkbox>
      }
    },{
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) =>
        props.dataSource?.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
            <Button danger>Delete</Button>
          </Popconfirm>
        ) : null,
    },
  ];
  const handleAdd = () => {
    const newData = {
      key: count,
      Name: "",
      Email: "",
      Mobile: "",
      Company: "",
      Car: false,
    };
    let checkBeforeAdd = true;
    props.dataSource.map(row => {
      if(row.Name === "") checkBeforeAdd = false
    })
    if(checkBeforeAdd) {
      props.setDataSource([...props.dataSource, newData]);
      setCount(count + 1);
    }
  };
  useEffect(() => {
    !props.PreviewMode ? handleAdd() : null
  }, [])
  const handleSave = (row) => {
    const newData = [...props.dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    props.setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
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
      }),
    };
  });





  return (
    <div>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={props.dataSource}
        setDataSource={props.setDataSource}
        columns={props.PreviewMode ? columns.filter(row => row.dataIndex !== "operation") : columns}
        pagination={false}
      />
      {
        !props.PreviewMode
        ? <>
            <span style={{color: '#bbb', fontStyle: 'italic', fontSize: '0.8rem', margin: '12px 0', display: 'block'}}>
              * Click on table cell to edit value
            </span>
            <Button onClick={handleAdd} type="dashed" style={{ marginBottom: 24}}>
              Add More
            </Button>
          </>
        : null
      }
    </div>
  );
};

export default EditableTable;