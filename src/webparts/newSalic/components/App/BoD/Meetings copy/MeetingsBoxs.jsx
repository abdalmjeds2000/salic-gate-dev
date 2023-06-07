import React from 'react'
import MeetingBox from './MeetingBox';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const initialMeeting = {
  id: Date.now(),
  title: '',
  date: null,
  points: [{id: Date.now(), value: ''}]
};
const MeetingsBoxs = ({ meetings, setMeetings }) => {

  const handleOnChange = (id, newValues) => {
    const changedItem = meetings.find(meeting => meeting.id === id);
    const newMeetings = meetings.map(meeting => meeting.id === id ? {...changedItem, ...newValues} : meeting);
    setMeetings(newMeetings);
  }

  const handleAddMeeting = () => {
    setMeetings(prev => [...prev, {...initialMeeting, id: Date.now()}]);
  }
  const handleRemoveMeeting = (id) => {
    const newMeetings = meetings.filter(meeting => meeting.id !== id);
    setMeetings(newMeetings);
  }

  return (
    <div>
      {meetings.map((meeting, i) => (
        <MeetingBox 
          key={i} 
          index={i + 1}
          meetData={meeting}
          onChangeItem={handleOnChange} 
          meetingsLength={meetings.length}
          onRemoveMeeting={handleRemoveMeeting}
        />
      ))}

      
      <Button 
        type="default" 
        size='large' 
        onClick={handleAddMeeting} 
        style={{ width: '100%', margin: '20px 0 30px 0' }}
        icon={<PlusOutlined />}>
        Add Meeting No. {meetings.length + 1}
      </Button>
    </div>
  )
}

export default MeetingsBoxs