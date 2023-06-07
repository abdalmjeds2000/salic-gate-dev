import React, { useEffect, useState } from 'react';
import { Modal, Table, Tooltip, Typography } from 'antd';
import { FiExternalLink } from 'react-icons/fi';
import moment from 'moment-hijri';
moment.locale('ar')
import SA from 'country-flag-icons/react/3x2/SA';
import UA from 'country-flag-icons/react/3x2/UA';
import GB from 'country-flag-icons/react/3x2/GB';
import CA from 'country-flag-icons/react/3x2/CA';
import IN from 'country-flag-icons/react/3x2/IN';
import AU from 'country-flag-icons/react/3x2/AU';



function calcTime(offset) {
  // create Date object for current location
  var d = new Date();

  // convert to msec
  // subtract local time zone offset
  // get UTC time in msec
  var utc = d.getTime() + (d.getTimezoneOffset() * 60000);

  // create new Date object for different city
  // using supplied offset
  var nd = new Date(utc + (3600000*offset));

  // return time as a string
  return `${nd.toLocaleString()}`;
}



const ClockComponent = (props) => {
  const [cTime, setTime] = useState(new Date().toUTCString().slice(0, 16) + ' ' + new Date().toLocaleTimeString());
  const [openModal, setOpenModal] = useState(false);

  var arMoment = moment().format('iYYYY/iM/iDهـ ');
  useEffect(() => {
    setInterval(() => {
      setTime(new Date().toUTCString().slice(0, 16) + ' ' + new Date().toLocaleTimeString());
    }, 1000);
  });



  const columns = [
    { title: 'Country', dataIndex: 'Country', ellipsis: true, width: '40%', render: (val) => <b style={{display: 'flex'}}>{val}</b> },
    { title: 'Timezone', dataIndex: 'Timezone', width: '20%' },
    { title: 'Time', dataIndex: 'Time', width: '40%' },
  ];


  const flagStyle = {
    width: '1.5rem',
    borderRadius: '3px',
    marginRight: '7px',
  }
  const data = [
    {
      Country: <><SA title="Saudi Arabia" style={flagStyle}/> Saudi Arabia</>,
      Timezone: 'UTC +03:00',
      Time: calcTime('+3'),
    },{
      Country: <><IN title="India" style={flagStyle}/> India</>,
      Timezone: 'UTC +05:30',
      Time: calcTime('+5'),
    },{
      Country: <><UA title="Ukrania" style={flagStyle}/> Ukrania</>,
      Timezone: 'UTC +02:00',
      Time: calcTime('+2'),
    },{
      Country: <><GB title="United Kingdom" style={flagStyle}/> United Kingdom</>,
      Timezone: 'UTC +00:00',
      Time: calcTime('+0'),
    },{
      Country: <><CA title="Canada" style={flagStyle}/> Canada</>,
      Timezone: 'UTC -04:00',
      Time: calcTime('-4'),
    },{
      Country: <><AU title="Australia" style={flagStyle}/> Australia</>,
      Timezone: 'UTC +11:00',
      Time: calcTime('+11'),
    },
  ]
  return (
    <>
      <div className='app-clock'>

        {/* <FontAwesomeIcon 
          icon={faCalendarDays} 
          style={{fontSize: props.EnableHijri ? '1.2rem' : '1rem'}} 
        /> */}
        <Tooltip title="Time zone" placement='bottom'>
          <span className='timezone-icon-span' onClick={() => setOpenModal(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width={`${props.EnableHijri ? '25' : '20'}`} height={`${props.EnableHijri ? '25' : '20'}`} x="0" y="0" viewBox="0 0 64 64"><g><path d="m32 62a30 30 0 1 1 30-30 2 2 0 0 1 -4 0 26 26 0 1 0 -26 26 2 2 0 0 1 0 4z" fill="#FFFFFF"  ></path><path d="m55 20h-46a2 2 0 0 1 0-4h46a2 2 0 0 1 0 4z" fill="#FFFFFF"  ></path><path d="m32 34h-28a2 2 0 0 1 0-4h28a2 2 0 0 1 0 4z" fill="#FFFFFF"  ></path><path d="m26 48h-17a2 2 0 0 1 0-4h17a2 2 0 0 1 0 4z" fill="#FFFFFF"  ></path><path d="m32 62c-8.411 0-15-13.178-15-30s6.589-30 15-30c7.229 0 13.271 9.786 14.691 23.8a2 2 0 0 1 -3.98.4c-1.167-11.515-5.773-20.2-10.711-20.2-5.2 0-11 10.678-11 26s5.8 26 11 26a2 2 0 0 1 0 4z" fill="#FFFFFF"  ></path><path d="m46 62a16 16 0 1 1 16-16 16.019 16.019 0 0 1 -16 16zm0-28a12 12 0 1 0 12 12 12.013 12.013 0 0 0 -12-12z" fill="#FFFFFF"  ></path><path d="m43 51a2 2 0 0 1 -1.414-3.414l2.414-2.414v-7.172a2 2 0 0 1 4 0v8a2 2 0 0 1 -.586 1.414l-3 3a1.992 1.992 0 0 1 -1.414.586z" fill="#FFFFFF"  ></path></g></svg>
          </span>
        </Tooltip>
        {/* <Button size='small' shape='round'>Subsidiaries Timezone</Button> */}
        <div style={{fontWeight: '500', fontSize: '0.8rem'}}>
          <span style={{display: 'block', lineHeight: '1.1'}}>{cTime}</span>
          {props.EnableHijri ? <span style={{display: 'block', lineHeight: '1.1'}}>{arMoment}</span> : null}
        </div>
      </div>

      <Modal
        title="Date & Time"
        open={openModal}
        onCancel={() => setOpenModal(false)}
        okButtonProps={{ style: {display: 'none'}}}
        destroyOnClose
        // className="more-width-antd-modal"
        >
        <div style={{overflowX: 'auto'}}>
          <Table
            columns={columns} 
            dataSource={data}
            pagination={false}
            footer={() => (
              <div style={{textAlign: 'center', width: '100%'}}>
                <Typography.Link href='https://www.timeanddate.com/worldclock/' target='_blank'>
                  <span>More</span> <FiExternalLink />
                </Typography.Link>
              </div>
            )}
          />
        </div>
      </Modal>
    </>
  )
}

export default ClockComponent