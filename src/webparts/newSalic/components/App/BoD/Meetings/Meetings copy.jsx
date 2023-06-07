import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { Button, Col, DatePicker, Form, Input, Row, Segmented, message } from 'antd';
import HistoryNavigation from '../../Global/HistoryNavigation/HistoryNavigation';
import { AppCtx } from '../../App';
import { CheckOutlined } from '@ant-design/icons';
import MeetingsBoxs from './Components/MeetingsBoxs';
import pnp from 'sp-pnp-js';
import useIsAdmin from '../../Hooks/useIsAdmin';
import AntdLoader from '../../Global/AntdLoader/AntdLoader';


const initialMeeting = {
  id: Date.now(),
  title: '',
  date: null,
  points: [{id: Date.now(), value: ''}]
};



const Meetings = ({ meetingType, listName, groupName }) => {
  const [form] = Form.useForm();
  const [meetings, setMeetings] = useState([initialMeeting]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { defualt_route } = useContext(AppCtx);
  const [quarter, setQuarter] = useState('Q1');
  const [isGroupUser] = useIsAdmin(groupName);

  const fetchMeetings = async () => {
    setLoading(true);
    const meetings = await pnp.sp.web.lists.getByTitle(listName).items.filter(`Quarter eq '${quarter}'`).get();
    if(meetings.length > 0) {
      /* group by MeetingTitle */
      form.setFieldsValue({
        MainTitle: meetings[0].MainTitle,
        Date: moment(meetings[0].Date),
      });
      const meetingsData = [];
      meetings.forEach((meeting) => {
        const index = meetingsData.findIndex((item) => item.title === meeting.MeetingTitle);
        if(index === -1) {
          meetingsData.push({
            id: Date.now(),
            title: meeting.MeetingTitle,
            date: (meeting.MeetingDate) ? moment(meeting.MeetingDate) : null,
            points: [{id: Date.now(), value: meeting.comment}]
          });
        } else {
          meetingsData[index].points.push({id: meeting.Id, value: meeting.comment});
        }
      });
      console.log('meetingsData ==> ', meetingsData);
      setMeetings(meetingsData);
    } else {
      setMeetings([initialMeeting]);
      form.resetFields();
    }
    setLoading(false);
  }
  useEffect(() => {
    fetchMeetings();
  }, [quarter]);
  useEffect(() => {
    document.title = `.:: SALIC Gate | ${meetingType} ::.`;
  }, []);

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
          Quarter: quarter,
          // Year: form_data.Year || '',
          MainTitle: form_data.MainTitle,
          Date: moment(form_data.Date)?.format('MM/DD/YYYY'),
          MeetingTitle: meeting.title,
          MeetingDate: moment(meeting.date)?.format('MM/DD/YYYY'),
          comment: point?.value,
        });
      });
    });

    console.log(data);
    data?.forEach(async (item) => {
      // await pnp.sp.web.lists.getByTitle(listName).items.add(item).then((res) => {
      //   console.log(res);
      // }).catch((err) => {
      //   console.log(err);
      // });
    });
    setLoading(false);
    form.resetFields();
    message.success('Meetings saved successfully');
    setMeetings([initialMeeting]);
  }

  if(!isGroupUser) return (<AntdLoader />);
  return (
    <>
      <HistoryNavigation>
        <a onClick={() => navigate(defualt_route + '/bod')}>BoD</a>
        <p>{meetingType}</p>
      </HistoryNavigation>

      <div className='table-page-container'>
        <div className='content'>
          <div className="header">
            <h1>{meetingType}</h1>
            <div>
              <Segmented 
                options={['Q1', 'Q2', 'Q3', 'Q4']}
                size='small' disabled={loading}
                value={quarter} onChange={setQuarter} 
                style={{ background: '#eee' }} />
            </div>
          </div>
          <div className='form'>
          <Form form={form} disabled={loading} layout='vertical' name="FormPage" onFinish={handleSubmit} onFinishFailed={onFailedValidate}>
            <Row gutter={12}>
              <Col xs={24} md={12}>
                <Form.Item name='MainTitle' label='Main Title' rules={[{ required: true, message: '' }]}>
                  <Input size='large' placeholder='Enter Main Title' />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name='Date' label='Date' rules={[{ required: true, message: '' }]}>
                  <DatePicker size='large' format='MM/DD/YYYY' style={{ width: '100%' }} placeholder='Pick a Date' />
                </Form.Item>
              </Col>
              {/* <Col xs={24} md={8}>
                <Form.Item name='Year' label='Year' size='large' style={{ width: '100%' }} rules={[{ required: true, message: '' }]}>
                  <DatePicker picker="year" />
                </Form.Item>
              </Col> */}
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