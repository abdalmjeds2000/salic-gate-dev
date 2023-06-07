import React, { useState } from 'react';
import { Modal, Typography } from 'antd';
import moment from 'moment';
import { CalendarOutlined } from '@ant-design/icons';
import './NewsItem.css';



function NewsItem({ title, body, createdDate }) {
  const [openModal, setOpenModal] = useState(false);

  const newsTitle = <Typography.Title level={4} style={{fontSize: '1.2rem'}}>{title}</Typography.Title>;
  const newsBody = <div className='research-news-paragraph'><div dangerouslySetInnerHTML={{__html: body}}></div></div>;
  const newsDate = <Typography.Text type='secondary'><CalendarOutlined /> {moment(createdDate).format('MM/DD/YYYY hh:mm:ss')}</Typography.Text>;
  return (
    <>
      <div className='research-weakly-news-item' onClick={() => setOpenModal(true)}>
        {newsTitle}
        <div className='ellipsis-paragraph'>
          {newsBody}
        </div>
        {newsDate}
      </div>
      <Modal
        title="The whole story"
        open={openModal} 
        okButtonProps={{style: {display: 'none'}}}
        onCancel={() => setOpenModal(false)}
        cancelText="Close"
        destroyOnClose
        closable={false}
        className='more-width-antd-modal'
      >
        {newsTitle}
        {newsBody}
        {newsDate}
      </Modal>
    </>



    // <div style={newsStyle} key={counter}>
    //   <div key={counter} className={`${!expand ? 'ellipsis-paragraph' : 'stop-ellipsis'}`}>
    //     <div dangerouslySetInnerHTML={{__html: body}}></div>
    //   </div>
    //   <Typography.Link style={{display: 'block', textAlign: 'center', color: '#d5d5d5'}} onClick={toggleExpand}>{ expand ? <CaretUpOutlined /> : <CaretDownOutlined /> }</Typography.Link>
    //   <Typography.Text type='secondary'><CalendarOutlined /> {moment(createdDate).format('MM/DD/YYYY hh:mm:ss')}</Typography.Text>
    // </div>
  )
}

export default NewsItem