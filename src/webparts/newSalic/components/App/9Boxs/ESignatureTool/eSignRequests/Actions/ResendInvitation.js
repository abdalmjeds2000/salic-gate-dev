import React from 'react';
import { List, message, Modal, Table } from 'antd';
import { useState } from 'react';
import { CheckCircleOutlined, SyncOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import AntdLoader from '../../../../Global/AntdLoader/AntdLoader';

const ResendInvitation = (props) => {
  const [openModal, setOpenModal] = useState(false)
  const [data, setData] = useState([])
  const [dataLoader, setDataLoader] = useState(true)

  let getInvitation = () => {
    setOpenModal(true)
    axios({
      method: 'GET',
      url: `https://dev.salic.com/api/Signature/Recipients?eDocumentId=${props.Id}`
    }).then((res) => {
      // const Rows = res.data.Data.map((r, i) => {
      //   return { 
      //     id: i,
      //     Number: i+1, 
      //     EmailAddress: r.EmailAddress, 
      //     Action: r.Status === "Signed" ? `Signed At ${r.Modified.replace('T', ' ').slice(0, -1)}` : {DocumentId: props.Id, Email: r.EmailAddress, Key: r.Key} 
      //   }
      // })
      setDataLoader(false)
      setData(res?.data?.Data)
    }).catch(err => {
      console.log(err); 
      setDataLoader(false)
    })
  }

  let sendInvite = (val) => {
    axios({
      method: "POST",
      url: "https://dev.salic.com/api/Signature/Invite",
      data: val
    }).then((res) => {
      res.data.Status === 200
      ? message.success("The invitation has been sent successfully!")
      : message.success("Failed to send invitation!")
    }).catch(err => {
      console.log(err)
      message.error("Something Wrong!")
    })
  }

  const columns = [
    {
      title: '#',
      width: '4%',
      render: (_, row) => data?.indexOf(row) + 1
    },{
      title: 'Recipient Name',
      dataIndex: 'EmailAddress',
      width: '38%'
    },{
      title: 'Action',
      width: '58%',
      render: (_, row) => (
        <div>
          {row?.Invitations?.length > 0 
          ? (
            <div style={{ marginBottom: 7 }}>
              {row?.Invitations?.map((item, i) => (
                <span style={{ display: 'block', lineHeight: 1.4 }} key={i}><CheckCircleOutlined />{' '}{item}</span>
              ))}
            </div>
          )
          : null}
          {/* {row.Invitations.length > 0 ? <List
            size="small"
            bordered
            style={{ marginBottom: 10 }}
            dataSource={row.Invitations}
            renderItem={(item) => <List.Item>- {item}</List.Item>}
          /> : null} */}
          {
            row.Status === "Pending" 
            ? <a onClick={() => sendInvite({DocumentId: props.Id, Email: row.EmailAddress, Key: row.Key})}>Invite</a> 
            : <span><CheckCircleOutlined /> Signed At {moment(row.Modified).format('MM/DD/YYYY hh:mm A')}</span>
          }
        </div>
      )
    },
  ]
  return (
    <>
      <a onClick={getInvitation}><SyncOutlined /> Resend Invitation</a>
      <Modal
        title="Resend Invitation"
        open={openModal}
        onCancel={() => setOpenModal(false)}
        className='more-width-antd-modal'
        okButtonProps={{ style: {display: 'none'}}}
      >
        {
          !dataLoader
          ? <Table 
              columns={columns} 
              dataSource={data} 
              pagination={{position: ['none', 'bottomCenter'], pageSize: 10, hideOnSinglePage: true }} 
            />
          : <AntdLoader />
        }
      </Modal>
    </>
  );
}
export default ResendInvitation;