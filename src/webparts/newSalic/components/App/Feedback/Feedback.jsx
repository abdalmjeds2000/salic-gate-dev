import { Button, Rate, Result, Typography } from 'antd';
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import TextArea from 'antd/lib/input/TextArea';
import { AppCtx } from '../App';


const Feedback = () => {
  const { defualt_route } = useContext(AppCtx);
  let navigate = useNavigate();
  const [rateVal, setRateVal] = useState(1);
  const [commentVal, setCommentVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handelSubmitFeedback = () => {
    setLoading(true);
    setIsSubmitted(true);
    setLoading(false);
  }

  const feedbackForm = (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 60 }}>
      <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
        <Typography.Text strong style={{ fontSize: "1.7rem", display: "block", marginBottom: 15 }}>Cutomer Satisfaction</Typography.Text>
        <Typography.Text style={{ fontSize: "1.2rem" }}>
          Please help us create a great experience for you by taking just one minute to share your honest feedback on your experience.
        </Typography.Text>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 5, flexWrap: "wrap", marginBottom: 40 }}>
          <Typography.Text>Disastrous</Typography.Text>
          <Rate
            allowClear={false}
            defaultValue={rateVal}
            value={rateVal}
            onChange={setRateVal}
            style={{ fontSize: "4rem", lineHeight: 0.7 }}
          />
          <Typography.Text>Fantastic</Typography.Text>
        </div>
        <div>
          <TextArea placeholder='Write a comment' rows={8} maxLength={10000} value={commentVal} onChange={e => setCommentVal(e.target.value)} />
        </div>
      </div>
      <div>
        <Button type='primary' size='large' onClick={handelSubmitFeedback}>Submit</Button>
      </div>
    </div>
  );
  const feedbackResult = (
    <Result
      status="success"
      title="Successfully Submit Your Feedback!"
      subTitle="Your feedback has been submitted successfully. These notes will be studied and work to improve any problem you encounter."
      extra={[
        <Button type='primary' loading={loading} onClick={() => navigate(defualt_route)}>Go Home</Button>,
      ]}
    />
  );


  return (
    <div className='standard-page'>
      <div style={{ minHeight: "calc(100vh - 134px)", borderRadius: 15, padding: 25, backgroundColor: "#fff" }}>
        {isSubmitted ? feedbackResult : feedbackForm}
      </div>
    </div>
  )
}

export default Feedback