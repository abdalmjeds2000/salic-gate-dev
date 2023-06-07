import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { Button, Col, DatePicker, Form, Input, Row, Segmented, message } from 'antd';
import HistoryNavigation from '../../Global/HistoryNavigation/HistoryNavigation';
import { AppCtx } from '../../App';
import { CheckOutlined, FormOutlined, FundProjectionScreenOutlined } from '@ant-design/icons';
import MeetingsBoxs from './Components/MeetingsBoxs';
import pnp from 'sp-pnp-js';
import useIsAdmin from '../../Hooks/useIsAdmin';
import AntdLoader from '../../Global/AntdLoader/AntdLoader';
import Tabs from '../../Global/CustomTabs/Tabs';
import ManageSnapshotsLinks from '../ManageSnapshotsLinks';

const uniqueId = () => {
  const dateString = Date.now().toString(36);
  const randomness = Math.random().toString(36).substr(2);
  return dateString + randomness;
};


const initialMeeting = {
  id: uniqueId(),
  title: '',
  date: null,
  points: [{id: uniqueId(), value: ''}]
};



const Meetings = ({ meetingType, listName, groupName }) => {
  const [form] = Form.useForm();
  const [meetings, setMeetings] = useState([initialMeeting]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { defualt_route } = useContext(AppCtx);
  const [quarter, setQuarter] = useState('Q1');
  const [isGroupUser] = useIsAdmin(groupName);
  const [link, setLink] = React.useState(null);
  const [isSnapshotsAdmin] = useIsAdmin("BoD Snapshots Admins");

  const fetchLink = async () => {
    try {
      const response = await pnp.sp.web.lists.getByTitle('BoD Snapshots Links').items.filter(`Title eq '${meetingType}'`).get();
      setLink(response[0]);
    } catch (error) {
      console.log(error);
    }
  }
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
            id: uniqueId(),
            title: meeting.MeetingTitle,
            date: (meeting.MeetingDate) ? moment(meeting.MeetingDate) : null,
            points: [{id: meeting.Id, value: meeting.comment, isExist: true}]
          });
        } else {
          meetingsData[index].points.push({id: meeting.Id, value: meeting.comment, isExist: true});
        }
      });
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
    fetchLink();
    document.title = `.:: SALIC Gate | ${meetingType} ::.`;
  }, []);

  const onFailedValidate = () => message.error('Please fill all required fields');

  const handleSubmit = async (form_data) => {
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

    const meetingsData = [];
    meetings.forEach((meeting) => {
      meeting.points.forEach((point) => {
        meetingsData.push({
          Id: point.id,
          isExist: point.isExist,
          MeetingTitle: meeting.title,
          MeetingDate: (meeting.date) ? meeting.date.format('MM/DD/YYYY') : null,
          comment: point.value,
          Quarter: quarter,
          MainTitle: form_data.MainTitle,
          Date: form_data.Date.format('MM/DD/YYYY'),
        });
      });
    });
    console.log('meetingsData ==> ', meetingsData);
    for(let i = 0; i < meetingsData.length; i++) {
      if(meetingsData[i].isExist) {
        delete meetingsData[i].isExist;
        await pnp.sp.web.lists.getByTitle(listName).items.getById(meetingsData[i].Id).update(meetingsData[i]);
      } else {
        delete meetingsData[i].Id;
        delete meetingsData[i].isExist;
        await pnp.sp.web.lists.getByTitle(listName).items.add(meetingsData[i]);
      }
    }
    setLoading(false);
    fetchMeetings().then(() => message.success('Meetings saved successfully'));
  }


  const content = (
    <div className="table-page-container" style={{top: 0, marginBottom: 25, padding: 0, minHeight: 'fit-content'}}>
      <div className='content'>
        <div className="header" style={{borderRadius: 0}}>
          <h1>{meetingType}</h1>
        </div>

        <div className='form' style={{overflow: 'hidden'}}>
          <div style={{ textAlign: 'center' }}>
            <Segmented 
              options={[{ value: 'Q1', label: 'Quarter 1' }, { value: 'Q2', label: 'Quarter 2' }, { value: 'Q3', label: 'Quarter 3' }, { value: 'Q4', label: 'Quarter 4' }]}
              size='large' disabled={loading}
              value={quarter} onChange={setQuarter} 
              style={{ background: '#eee', marginBottom: 25, padding: 7, overflow: 'hidden' }} />
          </div>
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
            <MeetingsBoxs meetings={meetings} setMeetings={setMeetings} listName={listName} />
            <div style={{ display: 'flex', justifyContent: 'end' }}>
              <Button type="primary" size='large' disabled={loading} htmlType='submit' icon={<CheckOutlined />}>
                Submit
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );

  const tabsItems = [
    {
      key: 'data', 
      icon: <FormOutlined />, 
      title: meetingType, 
      content: content
    },{
      key: "snapshot", 
      icon: <FundProjectionScreenOutlined />, 
      title: "Snapshot", 
      content: (
        <iframe
          name="reportFrame"
          src={link?.Link}
          width="100%"
          style={{ border: 0, minHeight: "calc(100vh - 215px)" }}
        />
      ),
    },
  ];


  if(!isGroupUser) return (<AntdLoader />);
  return (
    <>
      <HistoryNavigation>
        <a onClick={() => navigate(defualt_route + '/bod')}>BoD</a>
        <p>{meetingType}</p>
      </HistoryNavigation>

      <div className='standard-page'>
        <Tabs 
          items={tabsItems} 
          rightOfTabs={isSnapshotsAdmin && <ManageSnapshotsLinks defaultPage={meetingType} onUpdate={fetchLink} />} 
        />
      </div>
    </>
  )
}

export default Meetings