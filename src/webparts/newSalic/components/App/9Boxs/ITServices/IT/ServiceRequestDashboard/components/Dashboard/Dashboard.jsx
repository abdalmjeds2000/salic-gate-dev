import React, { useContext } from 'react';
import { Col, Row } from 'antd';
import UserSRSummary from './UserSRSummary/UserSRSummary';
import TypesSRSummary from './TypesSRSummary/TypesSRSummary';
import DepartmentSRSummary from './DepartmentSRSummary/DepartmentSRSummary';
import { AppCtx } from '../../../../../../App';

function Dashboard(props) {
  const { user_data } = useContext(AppCtx);
  const IsShowDepartmentSection = user_data.Data?.DirectUsers?.length > 0;

  // if(props.loading) {
  //   return <></>
  // }
  return (
    <div>
      <Row gutter={[8, 8]}>
        <Col xs={{span: 24}} sm={{span: 24}} md={{span: 24}} lg={{span: 12}} xl={{span: IsShowDepartmentSection ? 8 : 12}}>
          <UserSRSummary
            DataForUser={props.DataForUser}
            summaryByStatus={props.summaryByStatus}
            summaryByPriority={props.summaryByPriority}
          />
        </Col>

        {
          IsShowDepartmentSection
          ? (
            <Col xs={{span: 24}} sm={{span: 24}} md={{span: 24}} lg={{span: 12}} xl={8}>
              <DepartmentSRSummary
                DataForUser={props.DataForUser}
                summaryByDepartment={props.summaryByDepartment}
              />
            </Col>
            )
          : null
        }
        
        <Col xs={{span: 24}} sm={{span: 24}} md={{span: 24}} lg={{span: 12}} xl={{span: IsShowDepartmentSection ? 8 : 12}}>
          <TypesSRSummary
            DataForUser={props.DataForUser}
            summaryByRequestType={props.summaryByRequestType}
          />
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard