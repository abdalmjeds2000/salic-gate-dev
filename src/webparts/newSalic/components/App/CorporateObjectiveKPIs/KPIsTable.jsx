import React, { useContext, useEffect, useRef, useState } from "react";
import "./EditableForm.css";
import { Button, Collapse, Empty, Form, Input, InputNumber, message, Select, Space, Spin, Table } from "antd";
import GetObjectivesData from "./API/GetObjectivesData";
import UpdateItem from "./API/UpdateItem";
import { CaretDownOutlined, CaretUpOutlined, CheckOutlined, LoadingOutlined } from "@ant-design/icons";
import KpiComment from './components/KpiComment';
import DeleteKpi from './components/DeleteKpi';
import FilterColumns from './components/FilterColumns';
import { roundedNum } from '../Global/roundedNum';
import { groupedData } from './helpers/groupedData';
import CreateKPIItem from './components/CreateKPIItem';
import NewSelectItem from "./components/NewSelectItem";
import { AppCtx } from "../App";
import useIsAdmin from "../Hooks/useIsAdmin";
import { Web } from 'sp-pnp-js';
import { useNavigate } from "react-router-dom";


const EditableContext = React.createContext(null);
const EditableCell = (props, ownersList) => {
  const {
    editable,
    inputType,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  } = props;

  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  const [owners, setOwners] = useState([]);
  const { salic_departments } = useContext(AppCtx);

  useEffect(() => {
    if(ownersList) {
      setOwners(ownersList);
    }
  }, [ownersList]);


  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    console.log('record =>', record);
    setEditing(!editing);
    // form.setFieldsValue({
    //   [dataIndex]: record[dataIndex],
    // });
    form.setFieldsValue(record);
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      console.log('values=>>>', values);
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
      <div style={{ display: "flex", flexWrap: "nowrap", alignItems: "center" }}>
        {
          inputType === 'Q_target_actual' ? (
            <Space style={{ minWidth: 140, marginRight: 10 }}>
              <Form.Item style={{ margin: 0, flex: 1 }} name={"Actual" + dataIndex} rules={[{required: true,message: false}]}>
                <InputNumber ref={inputRef} parser={(value) => roundedNum(value)} size="small" onPressEnter={save} step={0.01} />
              </Form.Item>
              <span> / </span>
              <Form.Item style={{ margin: 0, flex: 1 }} name={"Target" + dataIndex} rules={[{required: true,message: false}]}>
                <InputNumber size="small" parser={(value) => roundedNum(value)} onPressEnter={save} step={0.01} />
              </Form.Item>
            </Space>
          ) : (
            <Form.Item style={{ margin: 0, flex: 1 }} name={dataIndex} rules={[{required: true,message: false},]} >
              {
                inputType === 'select' 
                ? (
                  <Select 
                    ref={inputRef} 
                    onPressEnter={save} 
                    size="small"
                    // onBlur={save}
                    // onSelect={save}
                    style={{ minWidth: 120 }}
                    placeholder="Choose Owner"
                    dropdownRender={(menu) => <NewSelectItem menu={menu} setItems={setOwners} />}
                  >
                    {[...owners, ...salic_departments]?.map((item, i) => <Select.Option key={i} value={item}>{item}</Select.Option>)}
                    {/* {salic_departments?.map((item, i) => <Select.Option key={i} value={item}>{item}</Select.Option>)} */}
                  </Select>
                ) :
                inputType === 'text' && record.field_1
                ? (
                  <Input ref={inputRef} size="small" onPressEnter={save} />
                ) : 
                inputType === 'number'
                ? <InputNumber ref={inputRef} parser={(value) => roundedNum(value)} size="small" onPressEnter={save} /* onBlur={save} */ step={0.01} />
                : null
              }
            </Form.Item>
          )
        }
        <Button type="primary" size="small" onClick={save}><CheckOutlined /></Button>
      </div>
    ) : (
      <div
        className={record.field_1 ? "editable-cell-value-wrap" : null}
        onClick={record.field_1 ? toggleEdit : null}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};
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






function KPIsTable({ kpiYear }) {
  const{ user_data, defualt_route } = useContext(AppCtx);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState([]);
  const [data, setData] = useState([]);
  const [focalPoints, setFocalPoints] = useState([]);
  const [isAdminUser] = useIsAdmin("KPIs Admins");
  const web = new Web('https://devsalic.sharepoint.com/sites/MDM');
  const navigate = useNavigate();

  async function getData() {
    setLoading(true);
    const sector = !isAdminUser ? user_data?.Data?.Sector : null;
    const response = await GetObjectivesData(kpiYear.year, sector);
    const reBuildData = groupedData(response);
    setData(reBuildData);
    const res_focalPoints = await web.lists.getByTitle("KPIs Focal Points").items.select('User/Title,User/EMail,*').expand('User').filter(`Sector eq '${user_data?.Data?.Sector}'`).get();
    setFocalPoints(res_focalPoints);

    setLoading(false);
  }

  const isFocalPoint = focalPoints?.filter((item) => item?.User?.EMail?.toLowerCase() === user_data?.Data?.Mail?.toLowerCase()).length > 0; 

  useEffect(() => {
    if( Object.keys(user_data).length > 0 ) {
      getData();
    }
  }, [kpiYear, user_data, isAdminUser]);

  let PerspectivesList = data?.map((r) => r.parent).filter(function (item, pos, self) { return self.indexOf(item) == pos; });

  const handleSave = async (row) => {
    const newData = [...data];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row, });
    if(
        newData[index].field_4 == data[index].field_4 && 
        newData[index].field_6 == data[index].field_6 && 
        newData[index].field_16 == data[index].field_16 && 
        newData[index].field_14 == data[index].field_14 && 
        newData[index].field_22 == data[index].field_22 &&
        newData[index].TargetQ1 == data[index].TargetQ1 &&
        newData[index].ActualQ1 == data[index].ActualQ1 &&
        newData[index].TargetQ2 == data[index].TargetQ2 &&
        newData[index].ActualQ2 == data[index].ActualQ2 &&
        newData[index].TargetQ3 == data[index].TargetQ3 &&
        newData[index].ActualQ3 == data[index].ActualQ3 &&
        newData[index].TargetQ4 == data[index].TargetQ4 &&
        newData[index].ActualQ4 == data[index].ActualQ4
      ) {
        console.log('No Changes')
      } else {
        const newUpdateData = {
          field_4: newData[index].field_4,
          field_6: newData[index].field_6,
          field_16: newData[index].field_16,
          field_22: newData[index].field_5 === "%" ? roundedNum(Number(newData[index].field_22) / 100) : roundedNum(Number(newData[index].field_22)),
          field_14: newData[index].field_5 === "%" ? roundedNum(Number(newData[index].field_14) / 100) : roundedNum(Number(newData[index].field_14)),
          TargetQ1: newData[index].field_5 === "%" ? roundedNum(Number(newData[index].TargetQ1) / 100) : roundedNum(Number(newData[index].TargetQ1)),
          ActualQ1: newData[index].field_5 === "%" ? roundedNum(Number(newData[index].ActualQ1) / 100) : roundedNum(Number(newData[index].ActualQ1)),
          TargetQ2: newData[index].field_5 === "%" ? roundedNum(Number(newData[index].TargetQ2) / 100) : roundedNum(Number(newData[index].TargetQ2)),
          ActualQ2: newData[index].field_5 === "%" ? roundedNum(Number(newData[index].ActualQ2) / 100) : roundedNum(Number(newData[index].ActualQ2)),
          TargetQ3: newData[index].field_5 === "%" ? roundedNum(Number(newData[index].TargetQ3) / 100) : roundedNum(Number(newData[index].TargetQ3)),
          ActualQ3: newData[index].field_5 === "%" ? roundedNum(Number(newData[index].ActualQ3) / 100) : roundedNum(Number(newData[index].ActualQ3)),
          TargetQ4: newData[index].field_5 === "%" ? roundedNum(Number(newData[index].TargetQ4) / 100) : roundedNum(Number(newData[index].TargetQ4)),
          ActualQ4: newData[index].field_5 === "%" ? roundedNum(Number(newData[index].ActualQ4) / 100) : roundedNum(Number(newData[index].ActualQ4)),
          Year: `${kpiYear.year}`
        };

        const updateResponse = await UpdateItem(newData[index].key, newUpdateData);
        if(isAdminUser) {
          await handleFocalPointSaveSector(newData[index].field_16);
        }
        message.success("The item has been modified successfully", 1);
        setData(newData);
        console.log('newUpdateData', newUpdateData)
      }
  };

  const handleFocalPointSaveSector = async (sector_name) => {
    const isExist = await web.lists.getByTitle("KPIs Focal Points").items.filter(`Sector eq '${sector_name}'`).get();
    if(isExist.length === 0) {
      const payload = { Sector: sector_name };
      await web.lists.getByTitle("KPIs Focal Points").items.add(payload);
    }
  }


  const [defaultColumns, setDefaultColumns] = useState([]);
  useEffect(() => {
    const columns_ = [
      {
        title: "KPI Information",
        key: "1",
        dataIndex: "field_4",
        showColumn: true,
        editable: isAdminUser,
        render: (val, record) => {
          return (
            record.field_1 ? (
              <div style={{ paddingLeft: "40px", lineHeight: "1.2", textAlign: 'left', minWidth: 250 }}>
                {record.field_19 === "Ascend" ? <><CaretUpOutlined style={{color: 'green'}} /> {val}</> : <><CaretDownOutlined style={{color: 'red'}} /> {val}</>}
              </div>
            ) : (
              <div
                style={{
                  paddingLeft: "20px",
                  lineHeight: "1.4",
                  textTransform: "capitalize",
                  fontSize: "1rem",
                  fontWeight: "400",
                  textAlign: 'left'
                }}
              >
                {record.header}
              </div>
            )
          )
        },
        onCell: (record, index) => {
          // record.Unit => to check if record just a title or full record
          return { colSpan: record.field_1 ? 1 : columns_.filter(c=>c.showColumn).length };
        },
        width: "45%",
      },
      {
        key: "2",
        title: "KPI Weights",
        dataIndex: "field_6",
        width: "10%",
        editable: isAdminUser,
        showColumn: true,
        render: (val) => <div style={{textAlign: 'center', minWidth: 80}}>{roundedNum(val)}</div>
      },
      {
        key: "4",
        title: "Owner",
        dataIndex: "field_16",
        width: "10%",
        showColumn: true,
        editable: isAdminUser,
        render: (val) => <div style={{textAlign: 'center', minWidth: 120}}>{val}</div>
      },
      {
        key: "99",
        title: "Q1",
        dataIndex: "Q1",
        width: "5%",
        showColumn: true,
        editable: true,
        render: (_, record) => (
          <div style={{textAlign: 'center', minWidth: 80}}>
            {roundedNum(record.ActualQ1)} / {roundedNum(record.TargetQ1)} {record?.field_5?.trim() === "%" ? '%' : ''}
          </div>
        )
      },{
        key: "99",
        title: "Q2",
        dataIndex: "Q2",
        width: "5%",
        showColumn: true,
        editable: true,
        render: (_, record) => (
          <div style={{textAlign: 'center', minWidth: 80}}>
            {roundedNum(record.ActualQ2)} / {roundedNum(record.TargetQ2)} {record?.field_5?.trim() === "%" ? '%' : ''}
          </div>
        )
      },{
        key: "99",
        title: "Q3",
        dataIndex: "Q3",
        width: "5%",
        showColumn: true,
        editable: true,
        render: (_, record) => (
          <div style={{textAlign: 'center', minWidth: 80}}>
            {roundedNum(record.ActualQ3)} / {roundedNum(record.TargetQ3)} {record?.field_5?.trim() === "%" ? '%' : ''}
          </div>
        )
      },{
        key: "99",
        title: "Q4",
        dataIndex: "Q4",
        width: "5%",
        showColumn: true,
        editable: true,
        render: (_, record) => (
          <div style={{textAlign: 'center', minWidth: 80}}>
            {roundedNum(record.ActualQ4)} / {roundedNum(record.TargetQ4)} {record?.field_5?.trim() === "%" ? '%' : ''}
          </div>
        )
      },

      {
        key: "13",
        title: "Annual Target",
        dataIndex: "field_14",
        width: "10%",
        showColumn: true,
        editable: true,
        render: (val, record) => <div style={{textAlign: 'center', minWidth: 100}}>
          {`${record?.field_5?.trim() === "%" ? `${roundedNum(Number(val))}%` : val+0}`}
        </div>
      },{
        key: "14",
        title: "Actual Full Year",
        dataIndex: "field_22",
        width: "10%",
        showColumn: true,
        editable: true,
        render: (val, record) => <div style={{textAlign: 'center', minWidth: 100}}>
          {`${record?.field_5?.trim() === "%" ? `${roundedNum(Number(val))}%` : val+0}`}
        </div>
      },{
        key: "15",
        title: "",
        width: "5%",
        showColumn: isAdminUser,
        render: (_, record) => (
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <KpiComment 
              getNewCommentValue={(newComment) => setData(prev => {prev.filter(row => row.Id===record.Id)[0].Comment = newComment; return prev})} 
              KpiTitle={record.field_4} 
              KpiId={record.Id} 
              CurrentComment={record.Comment}
            />
            <DeleteKpi
              KpiId={record.Id} 
              onSuccess={getData}
            />
          </div>
        ),
        onCell: (record, index) => {
          // record.Unit => to check if record just a title or full record
          return {colSpan: (isAdminUser && record.field_1) ? 1 : 0} 
        },
      },
    ];
    setDefaultColumns(columns_);
  }, [data, kpiYear, isFocalPoint, isAdminUser])
  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return {
        ...col, 
        onCell: (record) => ({ 
          colSpan: col.dataIndex === 'field_4' ? (record.field_1 ? 1 : defaultColumns.filter(c=>c.editable).length) : (record.field_1 ? 1 : 0) 
        }) 
      };
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        inputType: 
          col.dataIndex === 'field_16' 
          ? 'select' :
          col.dataIndex === 'field_4' 
          ? 'text' : 
          ['Q1', 'Q2', 'Q3', 'Q4'].includes(col.dataIndex)  
          ? 'Q_target_actual'
            : 'number',
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
        colSpan: col.dataIndex === 'field_4' ? (record.field_1 ? 1 : defaultColumns.filter(c=>c.editable).length) : (record.field_1 ? 1 : 0),
        // colSpan: !record.field_1 ? 0 : 1
      }),
    };
  });


  let OwnersList = data?.map((r) => r.field_16)?.filter(function (item, pos, self) { return self.indexOf(item) == pos; })?.filter(item => item);


  return (
    <div className="corporate-page-container">
      <Form form={form} component={false}>
        <div className="table-page-container" style={{ top: 0 }}>
          <div className="content">
            <div className="header">
              <h1>Corporate Objective KPIs during {kpiYear?.year}</h1>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                <FilterColumns setDefaultColumns={setDefaultColumns} />
                {isAdminUser && 
                  <>
                    <CreateKPIItem 
                      year={kpiYear.year} 
                      onSuccess={getData} 
                      data={data}
                    />
                    <Button type="primary" size="small" onClick={() => navigate(defualt_route + '/manage-focal-points')}>Manage Focal Points</Button>
                  </>}
              </div>
            </div>

            <div className="form">
              {!loading ? (
                <Collapse defaultActiveKey={["1"]}>
                  {PerspectivesList.map((row, i) => {
                    return (
                      <Collapse.Panel key={i + 1} header={`Perspective :: ${row}`}>
                        <div style={{ overflowX: "auto" }}>
                          <Table
                            columns={columns.filter(c => c.showColumn)}
                            dataSource={data?.filter((r) => r.parent === row && !r.ParentKPIId)}
                            pagination={false}
                            size="small"
                            components={ isAdminUser || isFocalPoint ? {body: {row: EditableRow, cell: (props) => EditableCell(props, OwnersList), }} : null }
                            rowClassName="editable-row"
                          />
                        </div>
                      </Collapse.Panel>
                    );
                  })}
                </Collapse>
              ) : (
                <Spin indicator={<LoadingOutlined spin />} style={{ padding: 50, display: "block", margin: "0 auto" }} />
              )}

              {(!loading && data.length === 0) ? <Empty /> : null}
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
}

export default KPIsTable;