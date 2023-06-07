import React, { useState } from 'react';
import moment from 'moment';
import { Button, Col, DatePicker, Form, Input, Row, message } from 'antd';
import HistoryNavigation from '../../Global/HistoryNavigation/HistoryNavigation';
import { useContext } from 'react';
import { AppCtx } from '../../App';
import { useNavigate } from 'react-router-dom';
import { CheckOutlined } from '@ant-design/icons';
import MeetingsBoxs from './MeetingsBoxs';
import pnp from 'sp-pnp-js';


const initialMeeting = {
  id: Date.now(),
  title: '',
  date: null,
  points: [{id: Date.now(), value: ''}]
};



const Meetings = () => {
  const [form] = Form.useForm();
  const [meetings, setMeetings] = useState([initialMeeting]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { defualt_route } = useContext(AppCtx);


  const onFailedValidate = () => message.error('Please fill all required fields');

  const handleSubmit = (form_data) => {
    setLoading(true);

    let error;
    meetings.forEach((meeting) => {
      if(meeting.title === '' || !meeting.date) error = true;
      meeting.points.forEach((point) => {
        if(point.value === '') error = true;
      });
    });

    if(error) {
      setLoading(false);
      onFailedValidate();
      return;
    }
    const data = [];
    meetings.forEach((meeting) => {
      meeting.points.forEach((point) => {
        data.push({
          MainTitle: form_data.MainTitle,
          Date: moment(form_data.Date).format('MM/DD/YYYY'),
          MeetingTitle: meeting.title,
          MeetingDate: moment(meeting.date).format('MM/DD/YYYY'),
          comment: point?.value,
        });
      });
    });


    data?.forEach(async (item) => {
      await pnp.sp.web.lists.getByTitle('BoD Meetings').items.add(item).then((res) => {
        console.log(res);
      }).catch((err) => {
        console.log(err);
      });
    });
    setLoading(false);
    form.resetFields();
    message.success('Meetings saved successfully');
    setMeetings([initialMeeting]);
  }

  return (
    <>
      <HistoryNavigation>
        <a onClick={() => navigate(defualt_route + '/bod')}>BoD</a>
        <p>Meetings</p>
      </HistoryNavigation>

      <div className='table-page-container'>
        <div className='content'>
          <div className="header">
            <h1>Meetings</h1>
          </div>
          <div className='form'>
          <Form form={form} layout='vertical' name="FormPage" onFinish={handleSubmit} onFinishFailed={onFailedValidate}>
            <Row gutter={15}>
              <Col xs={24} md={12}>
                <Form.Item name='MainTitle' label='Main Title' rules={[{ required: true, message: '' }]}>
                  <Input size='large' placeholder='Enter Main Title' />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name='Date' label='Date' rules={[{ required: true, message: '' }]}>
                  <DatePicker size='large' style={{ width: '100%' }} placeholder='Pick a Date' />
                </Form.Item>
              </Col>
            </Row>
            <MeetingsBoxs meetings={meetings} setMeetings={setMeetings} />
            <div style={{ display: 'flex', justifyContent: 'end' }}>
              <Button type="primary" size='large' disabled={loading} htmlType='submit' icon={<CheckOutlined />}>
                Submit
              </Button>
            </div>
          </Form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Meetings