import React from 'react';
import MeetingBox from './MeetingBox';
import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import pnp from 'sp-pnp-js';

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
const MeetingsBoxs = ({ meetings, setMeetings, listName }) => {

  const handleOnChange = async (id, newValues) => {
    const changedItem = meetings.find(meeting => meeting.id === id);
    const newMeetings = meetings.map(meeting => meeting.id === id ? {...changedItem, ...newValues} : meeting);
    setMeetings(newMeetings);
  }

  const handleRemovePoint = async (id) => {
    await pnp.sp.web.lists.getByTitle(listName).items.getById(id).delete();
    message.success('Point deleted successfully');
  }

  const handleAddMeeting = () => {
    setMeetings(prev => [...prev, {...initialMeeting, id: uniqueId()}]);
  }
  const handleRemoveMeeting = async (id) => {
    /* remove all points in deleted meeting from sharepoint list using for loop not foreach */
    const points = meetings.find(meeting => meeting.id === id).points;
    for(let i = 0; i < points.length; i++) {
      /* just if exist */
      if(points[i].isExist) {
        await pnp.sp.web.lists.getByTitle(listName).items.getById(points[i].id).delete();
      }
    }
    /* update state */
    const newMeetings = meetings.filter(meeting => meeting.id !== id);
    setMeetings(newMeetings);
    message.success('Meeting deleted successfully');
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
          onRemovePoint={handleRemovePoint}
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