import React, { useContext, useEffect, useState } from 'react';
import HistoryNavigation from '../../Global/HistoryNavigation/HistoryNavigation';
import { useNavigate, useParams } from 'react-router-dom';
import { AppCtx } from '../../App';
import { Alert, Steps, Tabs } from 'antd';
import { CommentOutlined, FileDoneOutlined, SendOutlined, WarningOutlined } from '@ant-design/icons';
import axios from 'axios';
import IncidentInfo from './PreviewIncidentReport/IncidentInfo';
import Assigning from './PreviewIncidentReport/Assigning';
import DepartmentFeedback from './PreviewIncidentReport/DepartmentFeedback';
import AntdLoader from '../../Global/AntdLoader/AntdLoader';
import useIsAdmin from '../../Hooks/useIsAdmin';





const PreviewIncidentReport = () => {
  const { id } = useParams();
  const { user_data, defualt_route, salic_departments } = useContext(AppCtx);
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [reportData, setReportData] = useState({});
  const [showOperationalLossForm, setShowOperationalLossForm] = useState(false);
  const [isRiskAdmin] = useIsAdmin('Incident_Admin');

  const getReportById = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://dev.salic.com/api/Incidents/GetById?Id=${id}`)
      setReportData(response?.data?.Data);
      setShowOperationalLossForm(response?.data?.Data?.FinancialImpact == 1);
      document.title = `.:: SALIC Gate | Incident Report #${response.data.Data.Number} ::.`;
    } catch (error) {
      setError(true);
    }
    setLoading(false);
  }
  useEffect(() => {
    if(id) {
      getReportById();
    } else {
      navigate(defualt_route + "/incidents-center");
    }
  }, []);


  const currentDepFeedbackData = reportData?.Assignees?.filter(item => item?.ToUser?.Mail?.toLowerCase() == user_data?.Data?.Mail?.toLowerCase())?.[0];

  /* if admin show tabs if not just show for current user */
  const departmentFeedbackContent = isRiskAdmin ? (
      <Tabs
        defaultActiveKey="0"
        type="card"
        items={reportData?.Assignees?.map((item, index) => ({
          key: index,
          label: item?.ResponsibleDepartment,
          children: <DepartmentFeedback reportData={reportData} formData={item || {}} onFinish={getReportById} />,
        }))}
      />
  ) : (
    <DepartmentFeedback reportData={reportData} formData={currentDepFeedbackData || {}} onFinish={getReportById} />
  );
  const stepsItems = [
    { 
      status: 'finish', title: <span style={{fontSize: '1.2rem'}}>Submission</span>, 
      content: <IncidentInfo reportData={reportData} />, 
      icon: <WarningOutlined />
    },{
      status: 'finish', title: <span style={{fontSize: '1.2rem'}}>Assigning</span>,
      content: <Assigning reportData={reportData} onFinish={getReportById} />,
      icon: <SendOutlined />
    },{
      status: 'finish', title: <span style={{fontSize: '1.2rem'}}>Department Feedback</span>,
      content: departmentFeedbackContent,
      icon: <FileDoneOutlined />,
      disabled: reportData?.Status === 'REVIEW',
    },{
      status: 'finish', title: <span style={{fontSize: '1.2rem'}}>Risk Action</span>,
      content: <div>Risk Action</div>,
      icon: <CommentOutlined />
    },
  ];
  return (
    <>
      <HistoryNavigation>
        <a onClick={() => navigate(`${defualt_route}/incidents-center`)}>Risk Center</a>
        <p>New Incident Report :: #{reportData?.Number || '???'}</p>
      </HistoryNavigation>

      <div className="standard-page">
        <div className='preview-incident-container'>
          <div className='header hide-scrollbar'>
            <Steps
              type="navigation"
              current={current}
              onChange={setCurrent}
              className="site-navigation-steps"
              items={stepsItems}
            />
          </div>
          
          <div className="content">
            {/* handle loading and errors */}
            {loading && <AntdLoader />}
            {error && <Alert
                        message="Error" type="error" showIcon style={{ margin: "25px"}}
                        description="Something is wrong, please check that the link above is correct or make sure you are connected to the Internet." />}
            {/* if no errors and data fetched show content */}
            {(!loading && !error) ? stepsItems[current]?.content : null}
          </div>
        </div>
      </div>
    </>
  )
}

export default PreviewIncidentReport