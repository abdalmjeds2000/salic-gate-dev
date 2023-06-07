import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Tooltip, Typography, Calendar, Badge, Modal, message, Col, Row } from 'antd';
import moment from 'moment';
import './UserCalendar.css';
import { BsCalendar3 } from 'react-icons/bs';


let CancelToken = axios.CancelToken;

const UserCalendar = ({ userData }) => {
  const [events, setEvents] = useState([]);
  const [eventsModal, setEventsModal] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  let cancel;
  const fetchEventsData = async (email, sDate, eDate) => {
    if(cancel) {
      cancel();
    }
    await axios.get(
      `https://dev.salic.com/api/user/calendar?Email=${email}&Start=${sDate}&End=${eDate}`,
      { cancelToken: new CancelToken(c => cancel = c) }
    )
    .then(({ data }) => setEvents(data.value || []))
    .catch(err => console.log(err))
  }
  // obj: {start, end, startStr, endStr, timeZone, view}
  const handleChangeDate = (obj, mode) => {
    let startDate;
    let endDate;
    const date = new Date(obj);
    const currentYear = new Date(obj).getFullYear();

    if(mode === "year") {
      startDate = new Date(currentYear, 0, 1).toISOString().split("T")[0];
      endDate = new Date(currentYear, 12, 1).toISOString().split("T")[0];
    } else if(mode === "month") {
      startDate = new Date(currentYear, date.getMonth(), 1).toISOString().split("T")[0];
      endDate = new Date(currentYear, date.getMonth() + 1, 1).toISOString().split("T")[0];
    }
    fetchEventsData(userData?.Mail, startDate, endDate);
  }

  useEffect(() => {
    if(userData && Object.keys(userData).length > 0) {
      const date = new Date();
      let startDate = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split("T")[0];
      let endDate = new Date(date.getFullYear(), date.getMonth() + 1, 1).toISOString().split("T")[0];
      fetchEventsData(userData?.Mail, startDate, endDate)
    }
  }, [userData])



  const colors = ['#6622bb', '#b42f38', '#232377', '#44ff66', '#4422ee', '#e65586','#ffa20a', '#a23881', '#342b36', '#733143', '#2ba54f', '#9c404f', '#ab354d', '#deafb2', '#b6f90b', '#2decde', '#259231', '#e65586', '#b861d0', '#6ef7ad', '#e54891', '#8f5701', '#a54d68', '#13b4c8', '#c86c7c', '#e873b1', '#fabeef', '#f2633b', '#752582', '#47a211', '#d0747a'];

  const getListData = (value) => {
    let listData;
    let d = value.date();
    let m = value.month();

    for (let index = 1; index <= 31; index++) {
      if(d === index){
        const ds = events.filter(d => index === new Date(d.start.dateTime).getDate() && m === new Date(d.start.dateTime).getMonth()) 
        .map(d => {
          d.themeColor = colors[index];
          return d;
        })
        ds.sort(function(a,b){return new Date(a.start?.dateTime).getTime() - new Date(b.start?.dateTime).getTime()});
        listData = ds
      }
    }
    return listData || [];
  };
  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <div className="events">
        {listData.map((item) => (
          // <EventComponent {...item} mode="month" />
          <div style={{ color: 'var(--main-color)', whiteSpace: 'nowrap' }}>
            <Tooltip mouseEnterDelay={0.3} title={`From: ${moment(item.start.dateTime).format('MM/DD/YYYY hh:mm A')}, to ${moment(item.end.dateTime).format('MM/DD/YYYY hh:mm A')}`}>
              <span>{moment.utc(item.start.dateTime).local().format('hh:mm A')}</span> {' '}
            </Tooltip>
            <Tooltip mouseEnterDelay={0.7} title={item.bodyPreview}>
              <a href={item.webLink} target="_blank" style={{ fontWeight: '500', color: 'var(--main-color)', textDecoration: item.isCancelled ? 'line-through' : 'unset' }}>
                {item.subject}
              </a>
            </Tooltip>
          </div>
        ))}
      </div>
    );
  };
  const dateCellRenderMobile = (value) => {
    const listData = getListData(value);
    return (
      <div 
        className={`events ${listData.length > 0 ? 'events-mobile' : ''}`} 
        onClick={() => {
          if(listData.length > 0) {
            setEventsModal(listData); 
            setOpenModal(true); 
          } else {
            message.destroy();
            message.info('There is No Events');
          }
        }}
        >
        {
          listData.length > 0 
          ? <span className='dot-btn' >
              <Badge status="processing"></Badge>
            </span>
          : null
        }
      </div>
    );
  };
  const getMonthData = (value) => {
    let listData;
    let y = value.month();
    for (let index = 1; index <= 12; index++) {
      if(y === index){
        const ds = events.filter(d => index === new Date(d.start.dateTime).getMonth())
        .map(d => {
          d.themeColor = colors[index];
          return d;
        })
        ds.sort(function(a,b){return new Date(a.start?.dateTime).getTime() - new Date(b.start?.dateTime).getTime()});
        listData = ds
      }
    }
    return listData || [];
  };
  const monthCellRender = (value) => {
    const listData = getMonthData(value);
    return (
      <div className="events">
        {listData.map((item) => (
          // <EventComponent {...item} mode="year" />
          <div style={{ color: 'var(--main-color)', whiteSpace: 'nowrap' }}>
            <Tooltip mouseEnterDelay={0.3} title={`From: ${moment(item.start.dateTime).format('MM/DD/YYYY hh:mm A')}, to ${moment(item.end.dateTime).format('MM/DD/YYYY hh:mm A')}`}>
              <span>{moment.utc(item.start.dateTime).local().format('MM/DD hh:mm A')}</span> {' '}
            </Tooltip>
            <Tooltip mouseEnterDelay={0.7} title={item.bodyPreview}>
              <a href={item.webLink} target="_blank" style={{ fontWeight: '500', color: 'var(--main-color)', textDecoration: item.isCancelled ? 'line-through' : 'unset' }}>
                {item.subject}
              </a>
            </Tooltip>
          </div>
        ))}
      </div>
    );
  };
  const monthCellRenderMobile = (value) => {
    const listData = getMonthData(value);
    return (
      <div 
        className={`events ${listData.length > 0 ? 'events-mobile' : ''}`} 
        onClick={() => {
          if(listData.length > 0) {
            setEventsModal(listData); 
            setOpenModal(true); 
          } else {
            message.destroy();
            message.info('There is No Events');
          }
        }}
        >
        {
          listData.length > 0 
          ? <span className='dot-btn' >
              <Badge status="processing"></Badge>
            </span>
          : null
        }
      </div>
    );
  };



  return (
    <div className='my-team_calendar-container' id='my-team_calendar-container'>

      <div className="desktop-calendar">
        <Calendar 
          dateCellRender={dateCellRender} 
          monthCellRender={monthCellRender} 
          onPanelChange={handleChangeDate}
        />
      </div>

      <div className="mobile-calendar">
        <Calendar 
          dateCellRender={dateCellRenderMobile} 
          monthCellRender={monthCellRenderMobile} 
          onPanelChange={handleChangeDate}
          fullscreen={false}
        />
      </div>




      <Modal
        title={<><BsCalendar3 /> My Calendar</>}
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={false}
        destroyOnClose
      >
        <div className="events">
          <div>
            {eventsModal.map((item) => <EventComponent {...item} mode="year" />)}
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default UserCalendar;


const EventComponent = (props) => {
  const boxStyles = {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  }
  return (
    <div className='event' style={boxStyles}>
      <Tooltip mouseEnterDelay={0.7} title={`From: ${moment(props.start.dateTime).format('MM/DD/YYYY hh:mm A')}, to ${moment(props.end.dateTime).format('MM/DD/YYYY hh:mm A')}`}>
        <Typography.Text type='secondary'>
          {
            props.mode == "month"
            ? (
              moment.utc(props.start.dateTime).local().format('hh:mm A')
            ) : (
              moment.utc(props.start.dateTime).local().format('MM/DD/YYYY hh:mm A')
            )
          }
        </Typography.Text> <br />
      </Tooltip>
      <Tooltip mouseEnterDelay={0.7} color={props.themeColor} title={props.bodyPreview}>
        <Typography.Link href={props.webLink} target="_blank">{props.subject}</Typography.Link>
      </Tooltip>

      {
        props.mode == "year"
        ? (
          <Typography.Paragraph ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}>
            {props.bodyPreview}
          </Typography.Paragraph>
        ) : (
          null
        )
      }

    </div>
  );
};

