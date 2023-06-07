import React, { useContext } from 'react';
import { Alert, Col, Row } from 'antd';
import { AppCtx } from '../App';
import Marquee from 'react-fast-marquee';

const WelcomeMessage = () => {
  const { user_data, showWelcomeMessage, setShowWelcomeMessage } = useContext(AppCtx);

  if(Object.keys(user_data).length > 0 && showWelcomeMessage) {
    return (
      <div>
        <Row>
          <Col xs={24} md={24}>
            <Alert
              message={<span>Hello <b>{user_data?.Data?.DisplayName}</b>, welcome to the new SALIC Gate</span>}
              description={<span>This is SALIC's new Gate. If you want to browse the old Gate, <a href='https://devsalic.sharepoint.com/sites/newsalic' target='_blank'><b>click here</b></a>. The previous SALIC gate will be deactivated at the end of this month.</span>}
              type="success"
              closable
              showIcon
              afterClose={() => setShowWelcomeMessage(false)}
            />
          </Col>
          {/* <Col xs={24} md={0}>
            <Alert
              type="success"
              banner
              closable
              message={
                <Marquee pauseOnHover gradient={false}>
                  <div style={{ marginRight: 150 }}>
                    Welcome {` ${user_data?.Data?.DisplayName} `} to the new SALIC Gate, if you want to browse the old Gate, <a href='https://devsalic.sharepoint.com/sites/newsalic' target='_blank'><b>click here</b></a>. The previous SALIC gate will be deactivated at the end of this month.
                  </div>
                </Marquee>
              }
              afterClose={() => setShowWelcomeMessage(false)}
            />
          </Col> */}
          
        </Row>
      </div>
    )
  }

  return <></>
  
  
}

export default WelcomeMessage