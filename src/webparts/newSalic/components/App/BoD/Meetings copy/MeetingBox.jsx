import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Input, Row, Typography } from 'antd'
import React from 'react'

const MeetingBox = ({ index, meetData, onChangeItem, meetingsLength, onRemoveMeeting }) => {
  const styles= {
    padding: '10px 25px',
    backgroundColor: '#f7f7f7',
    border: '1px solid #e8e8e8',
    borderRadius: '5px',
    marginBottom: '10px',
  };
  return (
    <div style={styles}>
      <Form.Item style={{ marginBottom: 0}}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography.Text style={{fontSize: '1.2rem', lineHeight: 3, fontWeight: '500'}}>Meeting: {index}</Typography.Text>
          {meetingsLength > 1 ? (
            <Button type='primary' shape='circle' danger onClick={() => onRemoveMeeting(meetData.id)}>
              <DeleteOutlined />
            </Button>
          ) : null}
        </div>
        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item label="Title" required style={{marginBottom: 15}}>
              <Input size='large' placeholder='Enter meeting title' value={meetData.title} onChange={(e) => onChangeItem(meetData.id, {title: e.target.value})} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Date" required style={{marginBottom: 15}}>
              <DatePicker size='large' format='MM/DD/YYYY' value={meetData.date} onChange={(moment) => onChangeItem(meetData.id, {date: moment})} placeholder='Pick a Date for meeting' style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label='Points:' required style={{marginBottom: 0, textAlign: 'center'}}>
              {meetData?.points?.map((point, index) => (
                <Form.Item key={index} style={{marginBottom: 5}}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5}}>
                    <Typography.Text style={{ fontWeight: '500' }}>{index+1}</Typography.Text>
                    <Input 
                      value={point.value} 
                      onChange={e => {
                        const newPoints = meetData?.points?.map(p => p.id === point.id ? {...point, value: e.target.value} : p);
                        onChangeItem(meetData.id, {points: newPoints})
                      }}
                      placeholder='Enter Point' />
                    
                        {meetData?.points?.length > 1 && <Button danger size='small' shape='circle' onClick={() => onChangeItem(meetData.id, {points: meetData?.points?.filter(p => p.id !== point.id)})}>
                      <DeleteOutlined />
                    </Button>}
                  </div>
                </Form.Item>
              ))}
              <Button size='small' shape='circle' onClick={() => onChangeItem(meetData.id, {points: [...meetData?.points, { id: Date.now(), value: '' }]})} icon={<PlusOutlined />} />
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>
    </div>

  )
}

export default MeetingBox