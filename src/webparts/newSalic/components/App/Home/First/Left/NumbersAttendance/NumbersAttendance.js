import React, { useContext, useEffect, useState } from 'react';
import './NumbersAttendance.css';
import Number from './Number/Number';
import Attendance from './Attendance/Attendance';
import {AppCtx} from '../../../../App';
import moment from 'moment';
import { Col, Row, Tooltip } from 'antd';
import AttendanceChart from '../../../../Global/AttendanceChart/AttendanceChart';
import NineBoxs from '../NineBoxs/NineBoxs';
import performaceGrade from '../../../../Global/performaceGrade';
import PerformanceModal from '../../../../Global/PerformanceModal/PerformanceModal';
import NextEventsModal from '../../../../Global/NextEventsModal/NextEventsModal';


function NumbersAttendance() {
  const { latest_attendance, user_data, performance, all_events } = useContext(AppCtx);
  const [openPerformanceModal, setOpenPerformanceModal] = useState(false);
  const [openEventsModal, setOpenEventsModal] = useState(false);


  const totalBalance = ((12-(new Date().getMonth()+1))*2.5)+performance?.leaves?.total;
  const attendancChartData = [
    { name: "Consumed This Year", value: performance?.leaves?.consumedThisYear, type: "Consumed" },
    { name: "Leave Balance", value: totalBalance, type: `Total balance till end of the year.` },
  ];





  useEffect(() => {
    const el = document.getElementById('home-chart');
    setTimeout(() => {
      el?.style?.opacity = 1;
    }, 2000);
  }, []);






  const upcomingEvents = all_events?.filter(nextEvnt => new Date(nextEvnt.Date).getTime() > new Date().getTime()).slice(0, 5);
  const isEventsEmpty = upcomingEvents && upcomingEvents?.length;

  return (
    <div className="numbers-attendance-container">
      <Row style={{ gap: 25 }}>
        {!["999999999", "000000000"].includes(user_data.Data?.PIN)
        ? (
          <>
            <Col order={1} style={{ width: "100%" }}>
              <div className='progress_section'>
                <div>
                  <Number
                    pathColor={performaceGrade(performance.performace?.count?.replace('%', '')).Color} 
                    textColor={performaceGrade(performance.performace?.count?.replace('%', '')).Color}
                    header={<Tooltip title="Click here to view your performance">
                      <span onClick={() => setOpenPerformanceModal(true)}>
                        % KPI Progress
                      </span>
                    </Tooltip>}
                    description={`Performance Management - ${new Date().getFullYear()}`}
                    // value={Object.keys(performance).length !== 0 ? performance.performace?.count?.replace('%', '') : '0'}
                    // text={Object.keys(performance).length !== 0 ? performance.performace?.count?.replace('%', '') : '?'}
                    value={0}
                    text='0'

                    minValue='0'
                    maxValue='100'
                  />
                </div>
                <div>
                  <Tooltip title="See Future Events">
                    <Number
                      pathColor='var(--main-color)' 
                      header={<Tooltip title="Click here to see upcoming events">
                        <span onClick={() => setOpenEventsModal(true)}>
                          Next Event
                        </span>
                      </Tooltip>} 
                      description={all_events.length > 0 ? all_events[0]?.Title : 'There are no upcoming events yet'} 
                      value={`${!isEventsEmpty ? '0' : moment(all_events[0]?.Date).diff(moment(), 'days')}`}
                      minValue='0'
                      maxValue={`${!isEventsEmpty ? 100 : moment(all_events[0]?.Date).diff(moment(all_events[0]?.Created), 'days')}`}
                      text={`${!isEventsEmpty ? ' - ' : moment(all_events[0]?.Date).diff(moment(), 'days')}`}
                      textColor='var(--main-color)'
                    />
                  </Tooltip>
                </div>
                <div className='leave_balance_mobile'>
                  <Number
                    pathColor='var(--brand-orange-color)' 
                    header={
                    <Tooltip title="Current Balance">
                      <span onClick={() => window.open('https://hen.fa.em2.oraclecloud.com/fscmUI/faces/deeplink?objType=ABSENCE_BALANCE&action=NONE', '_blank')}>
                        Leave Balance
                      </span>
                    </Tooltip>
                  } 
                    description="Current Balance" 
                    value={`${performance?.leaves?.total || '0'}`}
                    minValue='0'
                    maxValue="30"
                    text={`${performance?.leaves?.total || '?'}`}
                    textColor='var(--brand-orange-color)'
                  />
                </div>
              </div>
            </Col>
            <Col xs={{ order: 3 }} md={{ order: 2 }} style={{ width: "100%" }}>
              <div className='attendance_section'>
                <div className='latest_attendance'>
                  <Attendance latestAttendance={latest_attendance} />
                </div>  
                <div className='leave_balance'>
                  <AttendanceChart
                    data={attendancChartData}
                    totalBalance={totalBalance}
                    total={performance?.leaves?.total}
                    width={250}
                    height={150}
                  />
                </div>
              </div>
            </Col>
          </>
        ) : null }

        <Col xs={{ order: 2 }} md={{ order: 3 }} style={{ width: "100%" }}>
          <div>
            <NineBoxs />
          </div>
        </Col>
      </Row>


      <PerformanceModal
        openModal={openPerformanceModal} 
        setOpenModal={setOpenPerformanceModal}
        year={new Date().getFullYear()}
      />
      <NextEventsModal
        openModal={openEventsModal} 
        setOpenModal={setOpenEventsModal}
      />
    </div>
  )
}

export default NumbersAttendance