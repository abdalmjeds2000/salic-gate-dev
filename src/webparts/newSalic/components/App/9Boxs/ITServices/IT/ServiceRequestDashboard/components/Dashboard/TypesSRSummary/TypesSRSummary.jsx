import React from 'react';
import { Card, Typography } from 'antd';
import { Pie } from '@ant-design/plots';

function TypesSRSummary(props) {
  let RequestsCount = 0;
  const summaryByRequestType = (props.summaryByRequestType || []).map(num => {
    RequestsCount += num.Count;
    if(!num.Title) num.Title = "Defualt"
    else if(num.Title == 'BUG') num.Title = "Bugs Fixing"
    else if(num.Title == "CR") num.Title = "Change Request"
    else if(num.Title == "ER") num.Title = "Enhacement Request"
    else if(num.Title == "HelpDesk") num.Title = "Help Desk"
    else if(num.Title == "Permission") num.Title = "Permissions"
    return {...num}
  });

  const config = {
    innerHeight: '300px',
    appendPadding: 30,
    data: summaryByRequestType,
    angleField: 'Count',
    colorField: 'Title',
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: 'inner',
      offset: '-50%',
      content: '{value}',
      style: {
        textAlign: 'center',
        fontSize: 12,
      },
    },
    interactions: [
      {type: 'element-selected',},
      {type: 'element-active',},
    ],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        content: `${RequestsCount}`,
      },
    },
  };
  return (
    <div className='sr-by-types-chart card-container'>
      <Card title={<Typography.Text strong style={{fontSize: '1.2rem'}}>SR's By Type</Typography.Text>}>
        <Pie {...config} />
      </Card>
    </div>
  )
}

export default TypesSRSummary