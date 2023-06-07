import React, { useContext } from 'react';
import './HistoryNavigation.css';
import { useNavigate } from 'react-router-dom';
import { AppCtx } from '../../App';
import ClockComponent from './ClockComponent';

const HistoryNavigation = (props) => {
  const { defualt_route } = useContext(AppCtx)
  let navigate = useNavigate();

  return (
    <div className='history-navigation'>
      <div className="links">
        <a onClick={() => navigate(defualt_route)}>SALIC Gate</a>
        {props.children}
      </div>
      <ClockComponent EnableHijri={false} />
    </div>
  )
}

export default HistoryNavigation