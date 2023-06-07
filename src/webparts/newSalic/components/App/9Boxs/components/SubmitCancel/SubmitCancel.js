import React, { useContext } from 'react'
import { Button, Col, Row } from 'antd'
import { useNavigate } from 'react-router-dom';
import { AppCtx } from '../../../App';

function SubmitCancel(props) {
  const navigate = useNavigate();
  const { defualt_route } = useContext(AppCtx);
  return (
    <Row gutter={10} justify="center">
      {
        !props.isUpdate
        ? <Col>
            <Button type="primary" htmlType='submit' loading={props.loaderState} onClick={props.formSubmitHandler}>
              {props.isUpdate ? "Update" : "Submit"}
            </Button>
          </Col>
        : null
      }
      <Col>
        <Button danger type="primary" onClick={() => navigate(`${defualt_route}${props.backTo || '/admin-services'}`)}>
          Cancel
        </Button>
      </Col>
    </Row>
  )
}

export default SubmitCancel