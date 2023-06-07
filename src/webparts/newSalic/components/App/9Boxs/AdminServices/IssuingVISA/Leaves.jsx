import { Row, Spin, Typography } from 'antd';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { AppCtx } from '../../../App';
import { FcApproval } from 'react-icons/fc';
import { LoadingOutlined } from '@ant-design/icons';



const LeavesDatesComponent = ({title, count, dates}) => (
  <>
    <Row justify="space-between" align='middle'>
      <Typography.Text>{title}</Typography.Text>
      <Typography.Text>{count} days</Typography.Text>
    </Row>
    <Row justify="space-between" align='middle'>
      <Typography.Text type='secondary'><FcApproval /> Approved</Typography.Text>
      <Typography.Text type='secondary'>{dates}</Typography.Text>
    </Row>
  </>
)



const Leaves = (props) => {
  const { user_data } = useContext(AppCtx);
  const [loading, setLoading] = useState(false);


  const [current, setCurrent] = useState("1");
  const [annualData, setAnnualData] = useState({});
  const [businessData, setBusinessData] = useState([]);
  const [trainingData, setTrainingData] = useState([]);


  const handleReasonChange = async (reason, toUser, signal) => {
    setLoading(true);
    let url = "https://dev.salic.com/api/leave/";
    switch(reason) {
      case "1":
        setCurrent("1");
        await axios.get(url + `AnnualLeaveBalance?PIN=${toUser}`, { signal: signal })
          .then(({ data }) => {
            if(!data.Data || data.Data.Count === 0) {
              props.onChangeLeaves(false);
            } else {
              props.onChangeLeaves(true);
            }
            setAnnualData(data.Data || {})
          })
        break;
      case "2":
        setCurrent("2");
        await axios.get(url + `BusinessBalance?PIN=${toUser}`, { signal: signal })
          .then(({ data }) => {
            if(!data.Data || data.Data.length === 0) {
              props.onChangeLeaves(false);
            } else {
              props.onChangeLeaves(true);
            }
            setBusinessData(data.Data || [])
          })
        break;
      case "3":
        setCurrent("3");
        await axios.get(url + `TrainingBalance?PIN=${toUser}`, { signal: signal })
          .then(({ data }) => {
            if(!data.Data || data.Data.length === 0) {
              props.onChangeLeaves(false);
            } else {
              props.onChangeLeaves(true);
            }
            setTrainingData(data.Data || [])
          })
        break;
      default:
    }


    
    setLoading(false);
  }


  useEffect(() => {
    if(Object.keys(user_data).length > 0) {
      const controller = new AbortController();
      const signal = controller.signal;
      handleReasonChange(props.reasonId, props.toUser, signal);
      return () => {controller.abort();};
    }
  }, [props.reasonId, props.toUser])


  const NoRecords = () => <Typography.Text type='warning'>No Records</Typography.Text>;
  if(loading) {
    return <Typography.Text><Spin indicator={<LoadingOutlined spin />} /> Fetching Related Information</Typography.Text>

  } else {
    switch(current) {
      case "1":
        if(Object.keys(annualData).length > 0) {
          return (
            <LeavesDatesComponent 
              title="Annual Leave"
              count={annualData.Count}
              dates={annualData.Data}
            />
          )
        }
        return <NoRecords />
      case "2":
        if(businessData && businessData.length > 0) {
          return (
            <LeavesDatesComponent 
              title="Business Trip"
              count={businessData.length}
              dates={`${new Date(businessData[0]?.Date).toLocaleDateString()} - ${new Date(businessData[businessData.length-1]?.Date).toLocaleDateString()}`}
            />
          )
        }
        return <NoRecords />
      case "3":
        if(trainingData && trainingData.length > 0) {
          return (
            <LeavesDatesComponent 
              title="Training"
              count={trainingData.length}
              dates={`${new Date(trainingData[0]?.Date).toLocaleDateString()} - ${new Date(trainingData[trainingData.length-1]?.Date).toLocaleDateString()}`}
            />
          )
        }
        return <NoRecords />
      default:
    }
  }
  return <></>;
}

export default Leaves