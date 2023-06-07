import { ArrowLeftOutlined } from '@ant-design/icons';
import { Badge, Tooltip, Typography } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { AppCtx } from '../../../App';
import './TeamTree.css';



const TeamTree = ({ onChangeUser }) => {

  useEffect(() => {
    window.history.replaceState({}, document.title);
  }, []);

  const { user_data, sp_site } = useContext(AppCtx);
  const userAvatarURL = `${sp_site}/_layouts/15/userphoto.aspx?size=M&username=`;

  const [dataFor, setDataFor] = useState(user_data?.Data);
  const [activeUser, setActiveUser] = useState(user_data?.Data);
  const [countLevel, setCountLevel] = useState(0);



  useEffect(() => {
    if(Object.keys(user_data).length > 0) {
      setActiveUser(user_data.Data);
      setDataFor(user_data.Data);
    }
  }, [user_data]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    onChangeUser(dataFor, signal);
    return () => {controller.abort();};
  }, [dataFor]);





const Childrens = () => {
  return <div className='childrens'>
    {
      activeUser?.DirectUsers?.map(user => (
        <Badge count={user.DirectUsers?.length} status='success'>
          <Tooltip title={user?.DisplayName}>
            <div 
              key={user?.Id} 
              className={`child-item ${dataFor?.Mail === user?.Mail ? 'active' : ''}`}
              onClick={() => {
                if(user.DirectUsers?.length > 0) {
                  if(countLevel <= 1) {
                    setCountLevel(prev => prev + 1);
                    setActiveUser(user);
                  }
                }
                setDataFor(user);
              }}
            >
              <img src={userAvatarURL + user?.Mail} alt='' />
            </div>
          </Tooltip>
        </Badge>
      ))
    }
  </div>
}


  if(Object.keys(user_data).length === 0) {
    return null
  }
  return (
    <div className='team-tree-container' data-has-childrens={activeUser?.DirectUsers?.length > 0 ? "true" : "false"}>
      {
        user_data.Data?.Mail?.toLowerCase() !== dataFor?.Mail?.toLowerCase()
        ? (
          <span 
            className='back-btn'
            onClick={() => {
              setActiveUser(user_data.Data);
              setDataFor(user_data.Data);
              setCountLevel(0);
            }}
          >
            <Tooltip title="Click for Back to your Team" placement='right'>
              <Typography.Link><ArrowLeftOutlined /></Typography.Link>
            </Tooltip>
          </span>
        ) : (
          null
        )
      }
      
      <div className={`parent ${dataFor?.Mail === activeUser?.Mail ? 'active' : ''}`}>
        <span className='img' data-has-childrens={activeUser?.DirectUsers?.length > 0 ? "true" : "false"}>
          <img
            src={userAvatarURL + activeUser?.Mail}
            alt=''
            onClick={() => {
              setDataFor(activeUser);
            }}
          />
        </span>
        <div className='desc'>
          <Typography.Title level={4} title={activeUser?.DisplayName} ellipsis={{rows: 1, expandable: false}}>{activeUser?.DisplayName}</Typography.Title>
          <Typography.Text title={activeUser?.Title} ellipsis={{rows: 2, expandable: false}}>{activeUser?.Title}</Typography.Text>
        </div>
      </div>
      <div className='mobile-childrens'>
        <Childrens />
      </div>

      <div className='desktop-childrens'>
        <Childrens />
      </div>
    </div>
  )
}

export default TeamTree



