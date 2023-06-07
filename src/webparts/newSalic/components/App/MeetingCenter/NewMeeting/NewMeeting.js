import React, { useContext, useEffect, useState } from 'react'
import './NewMeeting.css'
import HistoryNavigation from '../../Global/HistoryNavigation/HistoryNavigation'
import Timeline from 'react-calendar-timeline'
import 'react-calendar-timeline/lib/Timeline.css'
import moment from 'moment'
import { useNavigate } from 'react-router-dom';
import { AppCtx } from '../../App';
import { Form, Input, DatePicker, Transfer, Select, Slider, Row, Col, Button, Space, InputNumber, Divider, message } from 'antd';
import axios from 'axios'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import AntdLoader from '../../Global/AntdLoader/AntdLoader'
import AutoCompleteSelectUsers from '../../Global/DropdownSelectUser/AutoCompleteSelectUsers'
import * as ReactQuill from 'react-quill'

const layout = { labelCol: { span: 6 }, wrapperCol: { span: 12 } };


function NewMeeting() {
  const { user_data, defualt_route } = useContext(AppCtx);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [reminder, setReminder] = useState('None');
  const [reminderTime, setReminderTime] = useState(0);
  const [targetKeys, setTargetKeys] = useState([]);
  const [clndrDte, setClndrDte] = useState(0);
  const [calendarData, setCalendarData] = useState([]);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [recurranceValue, setRecurranceValue] = useState('Never');
  const [transferLoading, setTransferLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);


  const GetDayEvents = async (day, _meetings) => {
    setCalendarLoading(true);
    setCalendarData([]);
    try {
      const obj = {
        Start: day.startOf('day').format('YYYY-MM-DDTHH:mm:ss'),
        End: day.endOf('day').format('YYYY-MM-DDTHH:mm:ss'),
        Email: user_data.Data.Mail,
        Resource: meetings.length ? meetings.map(r => r.address) : _meetings.length ? _meetings.map(r => r.address) : [],
      };
      const response = await axios.post('https://dev.salic.com/api/User/GetResourceSchedule', obj);
      
      let e = response.data.Data.value;
      let len = 1;
      let calendar = [];
      e.forEach(element => {
        let _events = JSON.parse(element.Events);
        _events.value.forEach(event => {
          let organizer = event.organizer.emailAddress.name;
          let startDate = moment.utc(event.start.dateTime).local();
          let endDate = moment.utc(event.end.dateTime).local();
          calendar.push({
            id: len,
            group: element.scheduleId,
            title: `(Organizer : ${organizer} ) (Status : ${event?.showAs}) ${startDate.format('HH:mm')} - ${endDate.format('HH:mm')}`,
            start_time: startDate,
            end_time: endDate,
            bgColor : event.showAs === 'busy' ? '#a94442' : 'orange',
          });
          len++;
        })
      });

      setCalendarData(calendar);
      console.log('calendar', calendar);
    } catch (error) {
      console.log(error);
    }
    setCalendarLoading(false);
  }

  useEffect(() => {
    if(meetings.length > 0) {
      GetDayEvents(moment().add(clndrDte, 'days'));
    }
  }, [clndrDte]);

  const fetchMeetings = async () => {
    try {
      const response = await axios.get(`https://dev.salic.com/api/Meeting/GetMeetingRooms?Email=${user_data.Data.Mail}`);
      if(response?.status == 200) {
        const data = response.data?.Data;
        const data2 = JSON.parse(data);
        setMeetings(data2.value);
        GetDayEvents(moment(), data2.value);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if(Object.keys(user_data).length > 0) {
      fetchMeetings();
    }
  }, [user_data]);




  const UpdateRoomList = async (dates, dateStrings) => {
    setTransferLoading(true);
    setTargetKeys([]);
    var obj = new Object();
        obj.Start = moment(dateStrings[0]).utc().format('YYYY-MM-DDTHH:mm:ss');
        obj.End = moment(dateStrings[1]).utc().format('YYYY-MM-DDTHH:mm:ss');
        obj.Email = user_data.Data.Mail;
        obj.Resource = meetings.map(r => r.address);

    console.log('obj', obj);
    try {
      const response = await axios.post('https://dev.salic.com/api/User/GetResourceSchedule', obj);
      let status = response.data.Data.value;
      if (status && status !== '') {
        let _newMeetings = meetings;
        status.forEach(element => {
          _newMeetings = _newMeetings.map(r => {
            if(r.address === element.scheduleId) {
              r.disabled = parseInt(element.availabilityView) !== 0 ? true : false;
            }
            return r;
          });
        });
        console.log('_newMeetings', _newMeetings);
        setMeetings(_newMeetings);
      }
    } catch (error) {
      console.log(error);
    }
    setTransferLoading(false);
  }

  const onChange = (nextTargetKeys, direction, moveKeys) => {
    setTargetKeys(nextTargetKeys);
  };



  async function CreateEvent(form_data) {
    if(targetKeys.length === 0) {
      message.error('Please select a room');
      return;
    }
    console.log('form_data', form_data);

    setSubmitLoading(true);

    var title = form_data.Title;
    var content = form_data.Agenda;

    var start = moment(form_data.Dates[0]).utc().format('YYYY-MM-DDTHH:mm:ss');
    var end = moment(form_data.Dates[1]).utc().format('YYYY-MM-DDTHH:mm:ss');

    var att = form_data.Attendance;

    var hasRecurrance = recurranceValue !== 'Never';
    var rStartDate, rEndDate, rInterval;
    if(hasRecurrance) {
      rStartDate = form_data.recurranceInterval[0];
      rEndDate = form_data.recurranceInterval[1];
      rInterval = form_data.intervalValue;
    }

    var hasReminder = reminder !== 'None';
    var reminderValue = reminderTime;

    var attendees = [];

    if (att) {
      att.forEach(user => {
        attendees.push({
          "emailAddress": {
            "name": "",
            "address": user?.value
          },
          "type": "required"
        });
      });
    }

    attendees.push({
        "emailAddress": {
            "name": meetings.filter(r => r.address === targetKeys[0])[0]?.name,
            "address": targetKeys[0]
        },
        "type": "Resource"
    });

    var event = {
        "subject": title,
        "body": {
            "contentType": "HTML",
            "content": content || ''
        },
        "start": {
            "dateTime": start,
            "timeZone": "UTC"
        },
        "end": {
            "dateTime": end,
            "timeZone": "UTC"
        },
        "location": {
            "displayName": meetings.filter(r => r.address === targetKeys[0])[0]?.name,
            "locationType": "Default"
        },
        "attendees": attendees
    }

    if (hasRecurrance) {
      event.recurrence = {
        "pattern": {
          "type": recurranceValue.toLowerCase(),
          "interval": rInterval,
          "daysOfWeek": [moment(start).utc().format('dddd')]
        },
        "range": {
          "type": "endDate",
          "startDate": moment(rStartDate).format('MM/DD/YYYY'),
          "endDate": moment(rEndDate).format('MM/DD/YYYY')
        }
      };
    }

    const payload = { Email: user_data.Data.Mail, Event: event };
  
    console.log(payload);

    try {
      const response = await axios.post('https://dev.salic.com/api/Meeting/CreateEvent', payload);
      if(response?.status == 200) {
        message.success('Meeting created successfully');
        navigate(`${defualt_route}/book-meeting-room/my-meetings`);
      }
    } catch (error) {
      console.log(error);
      message.error('Something went wrong');
    }
    setSubmitLoading(false);
  }


  return (
    <>
      <HistoryNavigation>
        <a onClick={() => navigate(`${defualt_route}/book-meeting-room`)}>Meetings Center</a>
        <p>Reserve Meeting Room</p>
      </HistoryNavigation>

      <div className='table-page-container'>
        <div className='content'>
          <div className="header">
            <h1>Reserve Meeting Room</h1>
          </div>

          <div className='form'>
            <Form
              {...layout}
              form={form}
              labelWrap 
              name="booking-meeting-room" 
              onFinish={CreateEvent}
              onFinishFailed={() => message.error('Please fill all the required fields')}
            >
              <Form.Item name="Title" label="Title" rules={[{required: true, message: ''}]}>
                <Input placeholder='Add a title for the meeting' size='large' />
              </Form.Item>
              <Form.Item label="Location">
                <Input defaultValue="SALIC HQ - Business Gate" size='large' disabled />
              </Form.Item>

              <Form.Item name="Dates" label="Start and End Time" rules={[{required: true, message: ''}]}>
                <DatePicker.RangePicker showTime format="MM/DD/YYYY HH:mm" size='large' onChange={UpdateRoomList} style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item label="Rooms" required>
                <Transfer
                  dataSource={meetings.map(item => ({ key: item.address, title: item.name, disabled: item.disabled || false }))}
                  titles={['Rooms', 'Selected Rooms']}
                  targetKeys={targetKeys}
                  disabled={transferLoading}
                  onChange={onChange}
                  listStyle={{ height: 200 }}
                  render={(item) => <span style={{ color: item.disabled ? '#ff000085' : '#333' }}>{item.title}</span>}
                />
              </Form.Item>


              <Form.Item label="Rooms Availablity">
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 5, marginBottom: 10 }}>
                  <Button type='primary' onClick={() => setClndrDte(0)} disabled={clndrDte === 0 || calendarLoading || transferLoading}>Today</Button>
                  <Space.Compact>
                    <Button type='primary' onClick={() => setClndrDte(prev => prev - 1)} disabled={calendarLoading || transferLoading}><LeftOutlined /></Button>
                    <Button type='primary' onClick={() => setClndrDte(prev => prev + 1)} disabled={calendarLoading || transferLoading}><RightOutlined /></Button>
                  </Space.Compact>
                </div>
                {!calendarLoading ? <Timeline
                  groups={meetings.map(item => ({ id: item.address, title: item.name }))}
                  items={calendarData}
                  defaultTimeStart={moment().add(clndrDte, 'days').startOf('day')}
                  defaultTimeEnd={moment().add(clndrDte, 'days').endOf('day')}
                  minZoom={60 * 60 * 1000}
                  maxZoom={(60 * 60 * 1000) * 12}
                  canChangeGroup={false}
                  sidebarWidth={60}
                  sidebarContent={'Room Name'}
                /> : <AntdLoader />}
              </Form.Item>

              <Form.Item name="Agenda" label="Agenda">
                <ReactQuill
                  id='editor'
                  style={{ background: "#fff", color: "black" }}
                  placeholder={"Write something ..."}
                />
              </Form.Item>

              <Form.Item label="Attendance">
                <AutoCompleteSelectUsers name="Attendance" size="large" isRequired={false} />
              </Form.Item>

              <Form.Item name="Recurrance" label="Recurrance" initialValue="Never">
                <Select onChange={selectedV => setRecurranceValue(selectedV)} size="large">
                  <Select.Option value="Never">Never</Select.Option>
                  <Select.Option value="daily">Daily</Select.Option>
                  <Select.Option value="weekly">Weekly</Select.Option>
                </Select>
              </Form.Item>
              {recurranceValue !== "Never" && <>
                <Form.Item name="intervalValue" label="Every" rules={[{required: true, message: ''}]} initialValue='1' style={{ marginBottom: 0}} extra={recurranceValue === "Daily" ? 'days' : 'weeks'}>
                  <Input size='large' />
                </Form.Item>
                <Form.Item name="recurranceInterval" label="Recurrance Interval" rules={[{required: true, message: ''}]}>
                  <DatePicker.RangePicker format="MM/DD/YYYY" size='large' style={{ width: '100%' }} />
                </Form.Item>
                <Divider />
              </>}


              <Form.Item name="Reminder" label="Reminder">
                <Select defaultValue="None" onChange={selectedV => setReminder(selectedV)} size="large" >
                  <Select.Option value="None">None</Select.Option>
                  <Select.Option value="Other">Other</Select.Option>
                </Select>
                {reminder === 'Other' && (
                    <>
                      <Slider
                        min={0}
                        max={30}
                        value={reminderTime}
                        onChange={v => setReminderTime(v)}
                      />
                      <p style={{color: '#a7a7a7'}}>{reminderTime} min</p>
                    </>
                )}
              </Form.Item>


              <Row gutter={10} justify="center">
                <Col>
                  <Button type="primary" htmlType='submit' size='large' loading={submitLoading}>
                    Submit
                  </Button>
                </Col>
              </Row>

            </Form>
          </div>
        </div>
      </div>
    </>
  )
}

export default NewMeeting