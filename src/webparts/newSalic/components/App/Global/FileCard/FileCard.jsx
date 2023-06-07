import React from 'react';
import './filecard.css';
import { Col, Row, Tooltip, Typography } from 'antd';
import moment from 'moment';




const FileCard = ({ icon, name, creatorName, createdDate, FilePath, IframLink, isFolder, canOpen, onClick }) => {
  return (
    <div className='file-card' onClick={isFolder && canOpen ? (e) => onClick(e) : () => window.open(FilePath)}>
      <div className='img-container'>{icon}</div>
      {
        createdDate 
        ? <Tooltip title={moment(createdDate).format('MM/DD/YYYY hh:mm')}>
            <Typography.Title level={5} style={{marginBottom: '15px', fontWeight: '400'}}>{name}</Typography.Title>
          </Tooltip>  
        : <Typography.Title level={5} style={{marginBottom: '15px', fontWeight: '400'}}>{name}</Typography.Title>
      }
      {creatorName && <Row align="middle">
        <Col>
          <Typography.Text type="secondary">{creatorName}</Typography.Text>
        </Col>
      </Row>}
    </div>
  )
}

export default FileCard