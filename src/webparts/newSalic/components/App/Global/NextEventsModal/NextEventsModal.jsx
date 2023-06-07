import React, { useContext, useEffect } from 'react';
import moment from 'moment';
import { Modal, Table } from 'antd'
import { AppCtx } from '../../App';
import pnp from 'sp-pnp-js';


const NextEventsModal = ({ openModal, setOpenModal }) => {
  const { user_data, all_events, setAllEvents } = useContext(AppCtx);
  const data = all_events?.filter(nextEvnt => new Date(nextEvnt.Date).getTime() > new Date().getTime()).slice(0, 5)
  const columns = [
    { title: 'Event', dataIndex: 'Title', width: '34%' },
    { title: 'Start Date', dataIndex: 'Date', width: '22%', render: (val) => moment(val).format('MM/DD/YYYY') },
    { title: 'End Date', dataIndex: 'EndDate', width: '22%', render: (val) => moment(val).format('MM/DD/YYYY') },
    { title: 'Remaining', dataIndex: '', width: '22%', render: (_, record) => `${moment(record.Date).diff(moment(), 'days')} Days Left` },
  ];

  const fetchEvents = async () => {
    const response = await pnp.sp.web.lists.getByTitle('Saudi Arabia Events').items.orderBy("Date", false).get()
    const data = response.filter(e => new Date(e.Date).toJSON().slice(0, 10) > new Date().toJSON().slice(0, 10)).reverse();
    setAllEvents(data);
  }
  useEffect(() => {
    fetchEvents();
  }, [user_data]);



  return (
    <Modal
      title="Next Events"
      open={openModal}
      onCancel={() => setOpenModal(false)}
      okButtonProps={{ style: {display: 'none'}}}
      // className="more-width-antd-modal"
    >
      <div style={{overflowX: 'auto'}}>
        <Table
          columns={columns} 
          dataSource={data}
          pagination={false}
        />
      </div>
    </Modal>
  )
}

export default NextEventsModal