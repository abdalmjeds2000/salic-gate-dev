import { Table, Tabs, Tag, Typography } from 'antd';
import React from 'react';
import moment from 'moment';
import UserColumnInTable from '../../../Global/UserColumnInTable/UserColumnInTable';
import FileIcon from '../../../Global/RequestsComponents/FileIcon';


function ActionsTable(props) {
  const columns = [
    {
      title: 'Message',
      dataIndex: 'Description',
      width: '35%',
      render: (val, record) => <div style={{display: 'grid', gap: '10px', minWidth: '150px'}}>
        <div>{val}</div>
        {record.Notes ? <div style={{ paddingLeft: 10 }}><Typography.Text type="secondary">{record.Notes}</Typography.Text></div> : null}
        <div>
          {
            record.Type === "FIN"
            ? record.Files.map((file, i) => {
                return <FileIcon
                  key={i} 
                  FileType={file.FileName.split('.')[file.FileName.split('.').length-1]}
                  FileName={file.FileName}
                  FilePath={file.Path}
                  IconWidth='30px'
                />
              })
            : null
          }
        </div>
      </div>
    },
    {
      title: 'Date',
      dataIndex: 'Date',
      width: '13%',
      render: (val) => moment(val).format("MM/DD/YYYY hh:mm")
    },
    {
      title: 'Status',
      dataIndex: 'StatusLabel',
      width: '12%',
    },
    {
      title: 'Approval Status',
      dataIndex: 'ApprovalStatus',
      width: '15%',
      render: (val, record) => {
        if(record.Type === "FIN") {
          return val == 1 ? <Tag color="success">Approved</Tag> : val == 0 ? <Tag color="error">Rejected</Tag> : null
        }
        return null
      }
    },
    {
      title: 'By',
      dataIndex: 'ToUser',
      width: '25%',
      render: (val, record) => ["FYI", "FIN"].includes(record.Type) ? <UserColumnInTable Mail={record?.ByUser?.Mail} DisplayName={record?.ByUser?.DisplayName}  /> : <UserColumnInTable Mail={val?.Mail} DisplayName={val?.DisplayName}  />
    },
  ];
  

  return (
    <div>
      <Tabs type='card'>
        <Tabs.TabPane tab={<span style={{ color: "var(--main-color)" }}>Actions History</span>}  key="item-1">
          <Table columns={columns} dataSource={props.ActionData} size="middle" pagination={false} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}

export default ActionsTable