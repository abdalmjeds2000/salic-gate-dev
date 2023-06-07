import React, { useContext, useEffect } from 'react';
import { Card, Select, Typography } from 'antd';
import { useState } from 'react';
import LineChart from '../../../../../../../Global/CustomLineChart/LineChart';
import { AppCtx } from '../../../../../../../App';
import { useNavigate } from 'react-router-dom';


function UserSRSummary(props) {
  const [dataBy, setDataBy] = useState("Status");
  const navigate = useNavigate();
  const { defualt_route } = useContext(AppCtx);


  const summaryByStatus = props.summaryByStatus;
  const summaryByPriority = props.summaryByPriority;

  let [totalCount, setTotalCount] = useState(0);
  useEffect(() => {
    let _TotalCount = 0;
    summaryByPriority?.forEach(element => _TotalCount += element.Count);
    setTotalCount(_TotalCount);
  }, [props.summaryByPriority]);

  const SubmittedCount = summaryByStatus?.filter(row => row.key=="SUBMITTED")[0]?.Count;
  const ProcessingCount = summaryByStatus?.filter(row => row.key=="PROCESSING")[0]?.Count;
  const ClosedCount = summaryByStatus?.filter(row => row.key=="CLOSED")[0]?.Count;

  const NormalCount = summaryByPriority?.filter(row => row.key=="1")[0]?.Count;
  const CriticalCount = summaryByPriority?.filter(row => row.key=="2")[0]?.Count;
  
  const CardTitle = (
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap'}}>
      <Typography.Text strong style={{fontSize: '1.2rem'}}>{props.DataForUser?.DisplayName}'s SR</Typography.Text>
      <Select
        defaultValue="Status"
        bordered={false}
        value={dataBy}
        style={{width: 90}}
        dropdownMatchSelectWidth={false}
        placement="bottomRight"
        onChange={val => setDataBy(val)}
        options={[{value: 'Status', label: 'Status'}, {value: 'Priority', label: 'Priority'}]}
      />
    </div>
  )






  return (
    <div className='sr-user-summary card-container'>
      <Card title={CardTitle}>
        <div className='tab-pane'>
          {
            dataBy == "Status"
            ? (
                <LineChart
                  totalCount={totalCount}
                  totalSpan="Total SR."
                  items={[
                    {title: "Submitted", count: SubmittedCount, type: "info", description: "Submitted and No Action", countLabel: `${SubmittedCount} SR.`, onClickLabel: () => navigate(defualt_route+`/services-requests/requests-assigned-for-me/Submitted`)},
                    {title: "Processing", count: ProcessingCount, type: "warning", description: "SR. currently you are working on", countLabel: `${ProcessingCount} SR.`, onClickLabel: () => navigate(defualt_route+`/services-requests/requests-assigned-for-me/Processing`)},
                    {title: "Closed", count: ClosedCount, type: "success", description: "SR. you Handled", countLabel: `${ClosedCount} SR.`, onClickLabel: () => navigate(defualt_route+`/services-requests/requests-assigned-for-me/Closed`)},
                  ]}
                /> 
              )
            : (
                <LineChart
                  totalCount={totalCount}
                  totalSpan="Total SR."
                  items={[
                    {title: "Normal", count: NormalCount, type: "info", description: "Normal SR. - Default", countLabel: `${NormalCount} SR.`, onClickLabel: () => navigate(defualt_route+`/services-requests/requests-assigned-for-me/Normal`)},
                    {title: "Critical", count: CriticalCount, type: "danger", description: "Urgent and Important SR.", countLabel: `${CriticalCount} SR.`, onClickLabel: () => navigate(defualt_route+`/services-requests/requests-assigned-for-me/Critical`)},
                  ]}
                /> 
              )
          }
        </div>
      </Card>
    </div>
  )
}

export default UserSRSummary