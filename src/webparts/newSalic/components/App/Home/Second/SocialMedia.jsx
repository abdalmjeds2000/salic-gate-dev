import React, { useContext } from 'react';
import { Col, Row, Tooltip } from 'antd';
import { PictureOutlined, ReadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { AppCtx } from '../../App';
import { Timeline } from 'react-twitter-widgets'
const SocialMedia = () => {
  const { defualt_route } = useContext(AppCtx);
  let navigate = useNavigate();

  return (
    <div className='division-3'>
      <div className="organization-documents-container" style={{marginBottom: 25}}>
        <div className="header">
          <h3>SALIC Content</h3>
        </div>
        <div className="boxs">
          <a onClick={_ => navigate(defualt_route + '/content-requests')} className="oranization-documents">
            <div>
              <PictureOutlined style={{fontSize: '1.5rem'}} />
            </div>
            <p>New Content Request</p>
          </a>
          {/* <a onClick={_ => navigate(defualt_route + '/almira-magazine')} className="oranization-documents">
            <div>
              <ReadOutlined style={{fontSize: '1.5rem'}} />
            </div>
            <p>Al Mira Magazine</p>
          </a> */}
          <a onClick={_ => navigate(defualt_route + '/salic-profile')} className="oranization-documents">
            <div>
              <ReadOutlined style={{fontSize: '1.5rem'}} />
            </div>
            <p>SALIC Profile</p>
          </a>
        </div>
      </div>

      <div className="twitter-wid">
        <div className="header">
          <h3>Social Media</h3>
          {/* <Row gutter={12}>
            <Col>
              <Row align="middle">
                <Tooltip title="New Content">
                  <a style={{fontSize: '1.3em'}} onClick={() => navigate(defualt_route + '/content-requests')}>
                    <PictureOutlined />
                  </a>
                </Tooltip>
              </Row>
            </Col>
            <Col>
              <Row align="middle">
                <Tooltip title="Al Mira Magazine">
                  <a style={{fontSize: '1.3em'}} onClick={() => navigate(defualt_route + '/almira-magazine')}>
                    <ReadOutlined />
                  </a>
                </Tooltip>
              </Row>
            </Col>
          </Row> */}
        </div>
        <Timeline
          dataSource={{
            sourceType: 'profile',
            screenName: 'KSA_SALIC'
          }}
          options={{
            height: '850'
          }}
        />
      </div>

    </div>
  )
}

export default SocialMedia