import React, { useContext, useEffect, useState } from 'react';
import './DashboardHeader.css';
import { AppCtx } from '../../../../App';
import { useNavigate } from 'react-router-dom';
import { FileSearchOutlined, RedoOutlined, SettingOutlined } from '@ant-design/icons';
import HeaderButton from './HeaderButton';
import pnp from 'sp-pnp-js';

const iconStyle = {
  color: 'var(--main-color)'
}

function DashboardHeader({ onRefresh }) {
  const { user_data, defualt_route } = useContext(AppCtx);
  const navigate = useNavigate();
  const [researchAdmins, setResearchAdmins] = useState([]);

  const fetchResearchAdmins = async () => {
    const groupName = 'Research_Admin';
    const users = await pnp.sp.web.siteGroups.getByName(groupName).users.get();
    setResearchAdmins(users);
  }
  useEffect(() => {
    if(Object.keys(user_data).length > 0) {
      fetchResearchAdmins();
    }
  }, [user_data])
  let isAdmin = false;
  researchAdmins.map(user => {
    if(user?.Email?.toLowerCase() === user_data?.Data?.Mail?.toLowerCase()) {
      isAdmin = true;
    }
  });

  return (
    <div className='research_header-container'>
      <HeaderButton
        title="Submit Research Request"
        icon={<FileSearchOutlined style={iconStyle} />}
        onClick={() => navigate(defualt_route+'/research-requests')} 
      />
      {isAdmin ? <HeaderButton
        title="Manage Library"
        icon={<SettingOutlined style={iconStyle} />}
        onClick={() => navigate(defualt_route+'/manage-research-library')} 
      /> : null}
      <HeaderButton
        title="Refresh"
        icon={<RedoOutlined style={iconStyle} />}
        onClick={onRefresh} 
      />
    </div>
  )
}

export default DashboardHeader