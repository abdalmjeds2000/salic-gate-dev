import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppCtx } from '../App';
import { Button, Result } from 'antd';
import HistoryNavigation from '../Global/HistoryNavigation/HistoryNavigation';


const PageNotFound = () => {
  const { defualt_route } = useContext(AppCtx);
  let navigate = useNavigate();

  return (
    <>
      <HistoryNavigation>
        <p>Page Not Found</p>
      </HistoryNavigation>
      <div className='standard-page'>
        <Result
          status="404"
          title="404"
          subTitle="Sorry, the page you visited does not exist."
          extra={<Button type="primary" onClick={() => navigate(defualt_route)}>Back Home</Button>}
        />
      </div>
    </>
  )
}

export default PageNotFound