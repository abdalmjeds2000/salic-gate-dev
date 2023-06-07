import React, { useContext, useEffect } from 'react';
import { Button, message, Modal, Select, Table } from 'antd';
import { useState } from 'react';
import { ShareAltOutlined, SyncOutlined, UserAddOutlined } from '@ant-design/icons';
import axios from 'axios';
import { AppCtx } from '../../../../App';
import AntdLoader from '../../../../Global/AntdLoader/AntdLoader';

function removeDuplicates(arr) {
  return arr.filter((item,
      index) => arr.indexOf(item) === index);
}


const ShareWith = (props) => {
  const { user_data, departments_info } = useContext(AppCtx)

  const [openModal, setOpenModal] = useState(false)
  const [data, setData] = useState([])
  const [dataLoader, setDataLoader] = useState(true)


  useEffect(() =>{
    axios({
      method: 'POST',
      url: "https://devsalic.sharepoint.com/sites/newsalic/_api/SP.UI.ApplicationPages.ClientPeoplePickerWebServiceInterface.ClientPeoplePickerSearchUser",
      data: { "queryParams": { "QueryString": "akmal", "MaximumEntitySuggestions": 30, "AllowEmailAddresses": true, "PrincipalType": 13, "PrincipalSource": 15, "QuerySettings": { "ExcludeAllUsersOnTenantClaim": false, "IsSharing": true } } },
      headers: {
        'accept': 'application/json;odata=verbose',
        'content-type': 'application/json',
      }
    }).then((res) => {
      console.log(res)
    }).catch(err => console.log(err))
  }, [])
  
  const [employees, setEmployees] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  useEffect(() => {
    const filterEmp = removeDuplicates(departments_info?.filter(e => e.Enabled && e.DisplayName?.length > 0).map(e => {return {email: e.Mail, name: e.DisplayName}}));
    setEmployees(filterEmp)
  }, [user_data, departments_info])



  let getShareWith = () => {
    setOpenModal(true)
    axios({
      method: 'GET',
      url: `https://dev.salic.com/api/Library/GetDocumentPermissions?DocumentId=${props.Id}`
    }).then((res) => {
      const Rows = res.data.Data.map((r, i) => {
        return { 
          id: i,
          Number: i+1, 
          UserName: r.Title, 
          Roles: r.Roles[0]?.Name, 
          Action: r.Roles[0]?.Name === "Full Control" ? '-' : r.LoginName.slice(18)
        }
      })
      setDataLoader(false)
      setData(Rows)
    }).catch(err => {
      console.log(err); 
      setDataLoader(false)
    })
  }

  let deletePermissionFromUser = (data) => {
    axios({
      method: 'Get',
      url: `https://dev.salic.com/api/DeletePermissionFromUser?DocumentId=${data.DocumentId}&Email=${data.Email}`
    }).then(res => {
      console.log(res)
      message.success('Permission has been removed from the user successfully.')
    }).catch((err) => {
      console.log(err)
      message.error('Failed to delete permission from the user.')
    })
  }



  const columns = [
    {
      title: '#',
      dataIndex: 'Number',
      key: 'Number',
      width: '3%'
    },{
      title: 'User Name',
      dataIndex: 'UserName',
      key: 'UserName',
      width: '70%'
    },{
      title: 'Roles',
      dataIndex: 'Roles',
      key: 'Roles',
      width: '15%'
    },{
      title: 'Action',
      dataIndex: 'Action',
      key: 'Action',
      width: '12%',
      render: (email) => {
        return email !== '-' && <Button type='link' danger onClick={() => deletePermissionFromUser({DocumentId: props.Id, Email: email})}>Delete</Button>
      }    
    },
  ]

  return (
    <>
      <a onClick={getShareWith}><ShareAltOutlined /> Share With</a>
      <Modal
        title="Share With"
        open={openModal}
        onCancel={() => setOpenModal(false)}
        okButtonProps={{ style: {display: 'none'}}}
      >

        <div style={{marginBottom: '15px', display: 'flex', flexDirection: '', justifyContent: 'flex-end', gap: '10px'}}>
          <Select
            showSearch
            style={{width: '100%'}}
            placeholder="Type to add new users"
            optionFilterProp="children"
            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
            filterSort={(optionA, optionB) =>
              optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
            }
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            {
              employees.map((user, i) => {
                return <Select.Option key={i} value={user.email}>{user.name}</Select.Option>
              })
            }
          </Select>

          {/* <DropdownSelectUser /> */}
          <Button type="primary" icon={<UserAddOutlined />}>Add</Button>
        </div>

        {
          !dataLoader
          ? <div style={{overflowX: 'auto'}}>
              <Table 
                columns={columns} 
                dataSource={data} 
                pagination={{position: ['none', 'bottomCenter'], pageSize: 10, hideOnSinglePage: true }} 
              />
            </div>
          : <AntdLoader />
        }
      </Modal>
    </>
  );
}
export default ShareWith;