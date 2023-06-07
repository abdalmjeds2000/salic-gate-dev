import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppCtx } from '../../App'; 
import CustomSelect from '../components/CustomSelect';
import '../DailyAttendance/DailyAttendance.css';
import AntdLoader from '../../Global/AntdLoader/AntdLoader';

function DailyAttendanceHR() {
  const { user_data, departments_info, salic_departments } = useContext(AppCtx)

  const gateEmployees = departments_info.filter(emp => emp.Department && emp?.Department !== "")

  const [departmentName, setDepartmentName] = useState(null);
  const [employees, setEmployees] = useState('-1');
  const [status, setStatus] = useState('-1');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tableData, setTableData] = useState([]);
  const [loader, setLoader] = useState(false);
  
  

  const [employeesOptions, setEmployeesOptions] = useState([]);
  useEffect(() => {
    let filteredEmployees = gateEmployees;
    setEmployeesOptions(filteredEmployees);
  }, [user_data, departments_info])

  useEffect(() => {
    let filteredEmployees = (departmentName != "" ? gateEmployees?.filter(item => item?.Department?.toLowerCase()?.includes(departmentName?.toLowerCase())) : gateEmployees);
    setEmployeesOptions(filteredEmployees);
    setStatus('-1');
    setEmployees('-1');
  }, [departmentName]);


  useEffect(() => {
    let newEmplList = gateEmployees;
    if(departmentName) {
      newEmplList = newEmplList.filter(item => departmentName?.toLowerCase() == item?.Department?.toLowerCase());
    }
    if(status == '1') {
      newEmplList = newEmplList.filter(u => u.Enabled);
    } else if(status == '0') {
      newEmplList = newEmplList.filter(u => !u.Enabled);
    }
    setEmployeesOptions(newEmplList);
  }, [status]);



  let filterResultsHandler = async (email) => {
    setLoader(true);
    try {
      let params = {
        Department: departmentName,
        Status: status,
        Email: email || employees,
        startDate: startDate,
        EndDate: endDate,
        month: startDate !== '' || endDate !== '' ? 0 : (new Date().getMonth() + 1),
        year: startDate !== '' || endDate !== '' ? 0 : (new Date().getFullYear()),
      };
      let queryStr = Object.keys(params).map(key => {
        let encodeValue = encodeURIComponent(params[key]);
        return `${key}=${encodeValue}`;
      }).join('&');
      // const url = `https://dev.salic.com/api/attendance/GetByEmail?Department=${departmentName}&Status=${status}&Email=${email || employees}&startDate=${startDate}&EndDate=${endDate}&month=${startDate !== '' || endDate !== '' ? 0 : (new Date().getMonth() + 1)}&year=${startDate !== '' || endDate !== '' ? 0 : (new Date().getFullYear())}`;
      const url = `https://dev.salic.com/api/attendance/GetByEmail?${queryStr}`;
      const response = await axios.get(url);
      setTableData(response?.data?.Data);
    } catch (error) {
      console.log(error); 
    }
    setLoader(false);
  }


  useEffect(() => {
    if(Object.keys(user_data).length > 0) {
      filterResultsHandler(user_data?.Data?.Mail)
    }
  }, [user_data])



  const handleChangeStatus = (e) => {
    setStatus(e.target.value);
  }


  const getExportLink = () => {
    let params = {
      Department: departmentName,
      Status: status,
      Email: employees,
      startDate: startDate,
      EndDate: endDate,
      month: startDate !== '' || endDate !== '' ? 0 : (new Date().getMonth() + 1),
      year: startDate !== '' || endDate !== '' ? 0 : (new Date().getFullYear()),
    };
    let queryStr = Object.keys(params).map(key => {
      let encodeValue = encodeURIComponent(params[key]);
      return `${key}=${encodeValue}`;
    }).join('&');

    return `https://dev.salic.com/api/attendance/Export?${queryStr}`;
  }
  const exportLink = getExportLink();


  return (
    <div className='daily-attendance-container'>
      <div className="content">
        <div className="form">
          <div className='inputs'>
          <CustomSelect 
              name='department' 
              label='Department'
              options={[{value: "", name: "Select Department"}, ...salic_departments.filter(dep => dep && dep !== '').map(item => ({value: item, name: item}))]}
              onChange={(e) => setDepartmentName(e.target.value)}
            />
            <CustomSelect 
              name='status' 
              label='Status'
              options={[
                {value: '-1', name: 'All'},
                {value: '1', name: 'Active'},
                {value: '0', name: 'In-Active'},
              ]}
              value={status}
              onChange={handleChangeStatus}
            />
            <CustomSelect 
              name='employee' 
              label='Employee' 
              options={[{value: "-1", name: "All"}, ...employeesOptions.map(item => {return {value: item.Mail, name: item.DisplayName}})]} 
              value={employees}
              onChange={(e) => setEmployees(e.target.value)} 
            />
            <div className='custom-select-container'>
              <label htmlFor="start-date">Start Date</label>
              <input type="date" name="start-date" id="start-date" onChange={e => setStartDate(e.target.value)} />
            </div>
            <div className='custom-select-container'>
              <label htmlFor="end-date">End Date</label>
              <input type="date" name="end-date" id="end-date" onChange={e => setEndDate(e.target.value)} />
            </div>
          </div>
          <div className="btns">
            <a style={{ color: "#fff" }} href={exportLink} target='_blank'>
              <button className='export' type='button'>Export Data</button>
            </a>
            <button className='filter' onClick={(e) => {e.preventDefault(); filterResultsHandler();}} disabled={loader || (!departmentName && employees == '-1')}>Filter Results</button>
          </div>
        </div>
        <div className="table">
          <table width='100%'>
            <tr>
              <th>Employee Name</th>
              <th>Date</th>
              <th>Day</th>
              <th>Check-In</th>
              <th>Check-Out</th>
              <th>W. Time</th>
              <th>W. Time (8-16)</th>
              <th>Late</th>
              <th>Early Leave</th>
              <th>Overtime</th>
              <th>Attendance Status</th>
              {/* <th>Emp. Justification</th>
              <th>Manager Feedback</th>
              <th>Approval Status</th> */}
            </tr>
            <tbody>
              {
                loader
                ? <tr><td colSpan={14} style={{padding: '25px 0'}}>
                    <AntdLoader />
                  </td></tr>
                : tableData?.map((row, i) => {
                    return <tr key={i}>
                      <td style={{ minWidth: 200 }}>{row.Name}</td>
                      <td>{row.Date || ' - '}</td>
                      <td>{row.Day  || ' - '}</td>
                      <td>{row.CheckInTime || ' - '}</td>
                      <td>{row.CheckOutTime || ' - '}</td>
                      <td>{row.ActualHours || ' - '}</td>
                      <td>{row.Working8_16 || ' - '}</td>
                      <td>{row.Late}</td>
                      <td>{row.EarlyLeave || ' - '}</td>
                      <td>{row.OverTime}</td>
                      <td>{row.Reason}</td>
                      {/* <td>{row.Justification || ' - '}</td>
                      <td>{row.ManagerFeedback || ' - '}</td>
                      <td>{row.JustificationStatus || ' - '}</td> */}
                    </tr>
                  })
              }
            </tbody>

          </table>
        </div>
      </div>
    </div>
  )
}

export default DailyAttendanceHR