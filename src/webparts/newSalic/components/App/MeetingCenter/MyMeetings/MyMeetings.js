import React, { useContext, useEffect, useState } from 'react'
import HistoryNavigation from '../../Global/HistoryNavigation/HistoryNavigation'
import { useNavigate } from 'react-router-dom';
import { AppCtx } from '../../App';
import { Table, Tooltip } from 'antd';
import axios from 'axios';
import UserColumnInTable from '../../Global/UserColumnInTable/UserColumnInTable';



function MyMeetings() {
  const { user_data, defualt_route } = useContext(AppCtx);
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 50,
    },
  });


  const fetchData = () => {
    setLoading(true);
    axios({method: 'GET',url: `https://dev.salic.com/api/Meeting/GetMyBooking?Email=${user_data?.Data?.Mail}&draw=4&order%5B0%5D%5Bdir%5D=asc&start=${tableParams.pagination.current === 1 ? '0' : (tableParams.pagination.current-1)*tableParams.pagination.pageSize}&length=50`})
    .then((res) => {
      let dataTable = [];
      const response = res?.data?.data;
      for(let key in response) {
        const row = {
          Key: key,
          Id: key,
          Organizer: {DisplayName: response[key]?.organizer?.emailAddress?.name, Email: response[key]?.organizer?.emailAddress?.address},
          Subject: response[key]?.subject,
          Start: new Date(response[key]?.start?.dateTime).toString().slice(0, 24),
          End: new Date(response[key]?.end?.dateTime).toString().slice(0, 24),
          Location: response[key]?.location?.displayName,
          Attendance: response[key]?.attendees,
        }
        dataTable.push(row);
      }
      setData(dataTable);
      setLoading(false);
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: res.data.recordsTotal, 
        },
      });
    }).catch(err => {
      console.log(err);
      setLoading(false);
    })
  }


  useEffect(() => {
    fetchData();
  }, [JSON.stringify(tableParams)]);

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'Id',
      key: 'Id',
      render: (val) => ((tableParams.pagination.current-1) * tableParams.pagination.pageSize) + Number(val) + 1
    },{
      title: 'Subject',
      dataIndex: 'Subject',
      key: 'Subject',
      render: (val) => <a>{val}</a>
    },{
      title: 'Start',
      dataIndex: 'Start',
      key: 'Start',
    },{
      title: 'End',
      dataIndex: 'End',
      key: 'End',
    },{
      title: 'Location',
      dataIndex: 'Location',
      key: 'Location',
    },{
      title: 'Attendance',
      dataIndex: 'Attendance',
      key: 'Attendance',
      render: (val) => val.length > 0 
                        ? <Tooltip placement="topRight" title={() => <div>{val.map(a => <div>{a?.emailAddress?.name}</div>)}</div>}>
                            <a>{val.length}</a>
                          </Tooltip> : <>0</>
      
    },{
      title: 'Organizer',
      dataIndex: 'Organizer',
      key: 'Organizer',
      render: (val) =>  <UserColumnInTable Mail={val.Email} DisplayName={val.DisplayName} />
    },
  ];


  return (
    <>
      <HistoryNavigation>
        <a onClick={() => navigate(`${defualt_route}/book-meeting-room`)}>Meetings Center</a>
        <p>My Meetings</p>
      </HistoryNavigation>
      <div className='table-page-container'>
        <div className='content'>
          <div className="header">
            <h1>My Meetings</h1>
          </div>

          <div style={{padding: '25px', overflowX: 'auto'}}>
            <Table
              columns={columns}
              rowKey={(record) => record.Id}
              dataSource={data}
              pagination={tableParams.pagination}
              loading={loading}
              onChange={handleTableChange}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default MyMeetings