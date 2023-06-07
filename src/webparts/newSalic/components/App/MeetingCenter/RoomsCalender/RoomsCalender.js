import React, { useContext, useEffect, useState } from 'react'
import HistoryNavigation from '../../Global/HistoryNavigation/HistoryNavigation'
import { useNavigate } from 'react-router-dom';
import { AppCtx } from '../../App';
import { Select, Table, Tooltip } from 'antd';
import axios from 'axios';
import UserColumnInTable from '../../Global/UserColumnInTable/UserColumnInTable';


function RoomsCalender() {
  const { defualt_route } = useContext(AppCtx);
  const navigate = useNavigate();

  const [roomTitle, setRoomTitle] = useState('meeting.room1@salic.com')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 50,
    },
  });
  const handleChange = (value) => setRoomTitle(value.value);

  const fetchData = () => {
    setLoading(true);
    axios({method: 'GET',url: `https://dev.salic.com/api/Meeting/GetMyBooking?Email=${roomTitle}&draw=4&order%5B0%5D%5Bdir%5D=asc&start=${tableParams.pagination.current === 1 ? '0' : (tableParams.pagination.current-1)*tableParams.pagination.pageSize}&length=50`})
    .then((res) => {
      let dataTable = [];
      const response = res?.data?.data;
      for(let key in response) {
        const row = {
          Key: key,
          Id: key,
          Organizer: {DisplayName: response[key]?.organizer?.emailAddress?.name, Email: response[key]?.organizer?.emailAddress?.address},
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
          total: res.data.recordsTotal, // 200 is mock data, you should read it from server
          // total: data.totalCount,
        },
      });
    }).catch(err => {
      console.log(err);
      setLoading(false);
    })
  }
  useEffect(() => {
    fetchData();
  }, [JSON.stringify(tableParams), roomTitle]);

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
      title: 'Organizer',
      dataIndex: 'Organizer',
      key: 'Organizer',
      render: (val) => <UserColumnInTable Mail={val.Email} DisplayName={val.DisplayName}  />
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
      
    },
  ];




  return (
    <>
      <HistoryNavigation>
        <a onClick={() => navigate(`${defualt_route}/book-meeting-room`)}>Meetings Center</a>
        <p>Rooms Calendar</p>
      </HistoryNavigation>
      
      <div className='table-page-container'>

        <div className='content'>
          <div className="header">
            <h1>Rooms Calendar</h1>
            <div>
              <Select
                labelInValue
                defaultValue={{
                  value: 'Meeting Room 1',
                  label: 'Meeting Room 1',
                }}
                onChange={handleChange}
                value={roomTitle}
              >
                <Select.Option value="meeting.room1@salic.com">Meeting Room 1</Select.Option>
                <Select.Option value="meeting.room3@salic.com">Meeting Room 3</Select.Option>
                <Select.Option value="meeting.room4@salic.com">Meeting Room 4</Select.Option>
              </Select>
            </div>
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

export default RoomsCalender