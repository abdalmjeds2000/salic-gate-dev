import React from 'react';
import './LineChartStyle.css';
import { Tooltip, Typography } from 'antd';
import ProgressRowItem from './ProgressRowItem';

const LineChart = ({items, totalCount, totalSpan}) => {
  return (
    <div className='custom-progress'>
      <Typography.Text style={{fontSize: '4em', display: 'inline-block', margin: '0 10px 10px 0', fontWeight: 700}}>
        {totalCount}
      </Typography.Text>
      <Typography.Text>{totalSpan}</Typography.Text>

      <div className='progress'>
        {
          items?.map((item, i) => (
            <Tooltip title={`${item.title}: ${item.count}`} color={item.color || '#000000'}>
              <div key={i} style={{width: `${(item.count/totalCount)*100}%`, backgroundColor: item.color}} className={`progress-bar bg-${item.type}`} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
            </Tooltip>
          ))
        }
      </div>

      {
        items?.map((item, i) => (
          <ProgressRowItem 
            key={i} 
            type={item.type} 
            title={item.title} 
            desc={item.description} 
            count={item.countLabel || item.count} 
            onClickLabel={item.onClickLabel}
            customColor={item.color}
          />
        ))
      }
    </div>
  )
}

export default LineChart