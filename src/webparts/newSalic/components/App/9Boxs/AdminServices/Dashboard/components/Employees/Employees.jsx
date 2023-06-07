import React, { useContext, useEffect, useState } from 'react';
import { AppCtx } from '../../../../../App';
import { Badge, Tooltip, Typography } from 'antd';
import "./EmployeesStyles.css";
import { ArrowLeftOutlined } from '@ant-design/icons';
import useIsAdmin from '../../../../../Hooks/useIsAdmin';

const faltternEmployees = (children, result = []) => {
  if(Array.isArray(children) && children?.length) {
    children.forEach(item => {
      result.push(item);
      if(item.DirectUsers.length) {
        faltternEmployees(item.DirectUsers, result);
      }
    })
  }
  return result
};

const Employees = ({ onChangeUser }) => {
  const { user_data, sp_site } = useContext(AppCtx);
  const userAvatarURL = `${sp_site}/_layouts/15/userphoto.aspx?size=M&username=`;
  const [dataFor, setDataFor] = useState(d__for);
  const [activeUser, setActiveUser] = useState(d__for);
  const [isAdmin, checkIsAdmin, admins, fetchAdmins] = useIsAdmin("Admin Users")





  // useEffect(() => {
  //   if(Object.keys(user_data).length > 0) {
  //     setActiveUser(user_data.Data);
  //     setDataFor(user_data.Data);
  //   }
  // }, [user_data]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    onChangeUser(dataFor, signal);
    console.log('dataFor', dataFor);
    return () => {controller.abort();};
  }, [dataFor]);

  // const __childresList = faltternEmployees(activeUser?.DirectUsers);
  const childresList = activeUser?.DirectUsers?.filter(user1 => 
    admins.some(user2 => user1?.Mail?.toLowerCase() === user2?.Email?.toLowerCase())
  );

  const Childrens = (
    <div className='childrens'>
      {
        childresList?.map(user => (
          <Tooltip title={user?.DisplayName}>
            <Badge count={user.DirectUsers?.length} status='success'>
              <div 
                key={user?.Id} 
                className={`child-item ${dataFor?.Mail === user?.Mail ? 'active' : ''}`}
                onClick={() => {
                  if(user?.DirectUsers?.length) {
                    setActiveUser(user);
                  }
                  setDataFor(user);
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <img src={userAvatarURL + user?.Mail} alt='' />
                  {user.Title && (
                    <div className='child-item-desc'>
                      <Typography.Title level={5} style={{ whiteSpace: "nowrap", lineHeight: 1 }}>{user.DisplayName}</Typography.Title>
                      <Typography.Text style={{ whiteSpace: "nowrap", fontSize: "0.8rem" }}>{user.Title}</Typography.Text>
                    </div>
                  )}
                </div>
              </div>
            </Badge>
          </Tooltip>
        ))
      }
    </div>
  );
  // if(Object.keys(user_data).length === 0) {
  //   return null
  // }
  return (
    <div className='team-tree-container' data-has-childrens={activeUser?.DirectUsers?.length > 0 ? "true" : "false"}>
      {/* {user_data.Data?.Mail?.toLowerCase() !== dataFor?.Mail?.toLowerCase() */}
      {d__for?.Mail?.toLowerCase() !== dataFor?.Mail?.toLowerCase()
        ? (
          <span 
            className='back-btn'
            onClick={() => {
              setActiveUser(/* user_data.Data */ d__for);
              setDataFor(/* user_data.Data */ d__for);
            }}
          >
            <Tooltip title="Click for Back to your Team" placement='right'>
              <Typography.Link><ArrowLeftOutlined /></Typography.Link>
            </Tooltip>
          </span>
        ) : null}
      <div className={`parent ${dataFor?.Mail === activeUser?.Mail ? 'active' : ''}`}>
        <span className='img' data-has-childrens={activeUser?.DirectUsers?.length > 0 ? "true" : "false"}>
          <img
            src={userAvatarURL + activeUser?.Mail}
            alt=''
            onClick={() => setDataFor(activeUser)}
          />
        </span>
        <div className='desc'>
          <Typography.Title level={4} title={activeUser?.DisplayName} ellipsis={{rows: 1, expandable: false}}>{activeUser?.DisplayName}</Typography.Title>
          <Typography.Text title={activeUser?.Title}>{activeUser?.Title}</Typography.Text>
        </div>
      </div>
      <div className='mobile-childrens'>{Childrens}</div>
      <div className='desktop-childrens'>{Childrens}</div>
    </div>
  )
}

export default Employees




const d__for = {
  "Department": "Procurement and Admin Services",
  "DisplayName": "Sultan Al-Dawood",
  "Title": "VP of Procurement and Admin Services",
  "Mail": "sultan.aldawood@salic.com",
  "DirectUsers": [
    {
      "Department": "Procurement and Admin Services",
      "DisplayName": "Fawaz Aladhyani",
      "Title": "Government Relations",
      "Mail": "Fawaz.Aladhyani@salic.com",
      "DirectUsers": [
        {
          "Department": "Procurement and Admin Services",
          "DisplayName": "Ibrahim Al-Habib",
          "Mail": "ibrahim.alhabib@salic.com",
        }
      ]
    },{
      "Department": "Procurement and Admin Services",
      "DisplayName": "Esaam Alaskar",
      "Title": "Administrative",
      "Mail": "Esaam.Alaskar@salic.com",
      "DirectUsers": [
        {
          "Department": "Procurement and Admin Services",
          "DisplayName": "Hassan Alyami",
          "Mail": "hassan.alyami@salic.com",
        },{
          "Department": "Procurement and Admin Services",
          "DisplayName": "Norah Almutairi",
          "Mail": "Norah.Almutairi@salic.com",
        }
      ]
    }
  ]
}