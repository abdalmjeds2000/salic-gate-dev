import React from 'react';
import { Col, Input, message, Row, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';


const Header = ({ handleSearch }) => {
  return (
    <div className='search-page-header'>
      <Typography.Title level={1}>Search Inside SALIC Gate</Typography.Title>

      <div>
        <Row gutter={25} justify="center">
          <Col sm={24} md={20} lg={18}>
            <Input.Search 
              placeholder="input search text" 
              enterButton={<><SearchOutlined /> Search</>}
              onSearch={value => value.trim().length >= 3 ? handleSearch(value) : message.info("Enter 3 character or more", 1)}
              size="large" 
              loading={false} 
              style={{borderRadius: '7px', overflow: 'hidden'}}
            />
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Header