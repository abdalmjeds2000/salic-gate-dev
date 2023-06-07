import React, { useContext, useEffect, useState } from 'react';
import HistoryNavigation from '../Global/HistoryNavigation/HistoryNavigation';
import { AppCtx } from '../App';
import OrganizationalChart from "./D3OrgChart/orgChart";
import AntdLoader from '../Global/AntdLoader/AntdLoader';
import axios from 'axios';
import { ApartmentOutlined, TeamOutlined } from '@ant-design/icons';
import Tabs from '../Global/CustomTabs/Tabs';



function appendChild (n, all, index){
  var xx = all.filter(x=>x.pid === n.id);
  index++;
  for (var s of xx){
    if(index > 5) {
      index = 5
    }
    n.INDEX = index;
    appendChild(s, all, 0);
  }
}





function Communication() {
  const { user_data, communicationList, setCommunicationList } = useContext(AppCtx);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const response = await axios.get('https://dev.salic.com/api/User/GetCommunicationList');
    if(response.status == 200) {
      setCommunicationList(response.data.Data);
    }
    setLoading(false);
  }
  useEffect(() => {
    if(Object.keys(user_data).length > 0 && communicationList.length === 0) {
      fetchData();
    }
  }, [user_data]);



  if(Object.keys(communicationList)?.length === 0) {
    return <AntdLoader />
  }


  return (
    <>
      <HistoryNavigation>
        <p>Communication</p>
      </HistoryNavigation>


      <div className='standard-page'>
        <OrganizationalChart data={communicationList} />
      </div>
    </>
  );
}

export default Communication