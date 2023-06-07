import React, { useState } from 'react';
import { Card, Select, Typography } from 'antd';
import LineChart from '../../../../../../../Global/CustomLineChart/LineChart';


function DepartmentSRSummary(props) {
  const [dataBy, setDataBy] = useState("Status");
  const summaryByDepartment = props.summaryByDepartment;

  let TotalCount = summaryByDepartment?.Total;
  const SubmittedCount = summaryByDepartment?.Data?.Status?.filter(row => row.key=="SUBMITTED")[0]?.Count;
  const ProcessingCount = summaryByDepartment?.Data?.Status?.filter(row => row.key=="PROCESSING")[0]?.Count;
  const ClosedCount = summaryByDepartment?.Data?.Status?.filter(row => row.key=="CLOSED")[0]?.Count;
  const ApprovalCount = summaryByDepartment?.Data?.Status?.filter(row => row.key=="APPROVAL")[0]?.Count;

  const NormalCount = summaryByDepartment?.Data?.Priority?.filter(row => row.key=="1")[0]?.Count;
  const CriticalCount = summaryByDepartment?.Data?.Priority?.filter(row => row.key=="2")[0]?.Count;
  

  const CardTitle = (
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap'}}>
      <Typography.Text strong style={{fontSize: '1.2rem'}}>{summaryByDepartment?.Name} SR.</Typography.Text>
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
    <div className='card-container'>
      <Card title={CardTitle}>
        <div className='tab-pane'>
          {
            dataBy == "Status"
            ? (
                <LineChart
                  totalCount={TotalCount}
                  totalSpan="Total SR."
                  items={[
                    {title: "Submitted", count: SubmittedCount, type: "info", description: "Submitted and No Action", countLabel: `${SubmittedCount} SR.`},
                    {title: "Processing", count: ProcessingCount, type: "warning", description: "SR. currently you are working on", countLabel: `${ProcessingCount} SR.`},
                    {title: "Closed", count: ClosedCount, type: "success", description: "SR. you Handled", countLabel: `${ClosedCount} SR.`},
                    {title: "Waiting For Approval", count: ApprovalCount, type: "wait", description: "Approval SR.", countLabel: `${ApprovalCount} SR.`},
                  ]}
                /> 
              )
            : (
                <LineChart
                  totalCount={TotalCount}
                  totalSpan="Total SR."
                  items={[
                    {title: "Normal", count: NormalCount, type: "info", description: "Normal SR. - Default", countLabel: `${NormalCount} SR.`},
                    {title: "Critical", count: CriticalCount, type: "danger", description: "Urgent and Important SR.", countLabel: `${CriticalCount} SR.`},
                  ]}
                /> 
              )
          }
        </div>
      </Card>
    </div>
  )
}

export default DepartmentSRSummary