import React, { useContext } from 'react';
import { Button, Descriptions, List, Typography } from 'antd';
import { AiOutlineNumber } from 'react-icons/ai';
import { TbCalendarMinus } from 'react-icons/tb';
import moment from 'moment';
import { MdEmojiFlags } from 'react-icons/md';
import { BiMoney } from 'react-icons/bi';
import { RiFileList3Line, RiSkullLine } from 'react-icons/ri';
import { FiFileText } from 'react-icons/fi';
import { riskType } from '../../risksTypes';
import Section from '../../../Global/RequestsComponents/Section';
import FileIcon from '../../../Global/RequestsComponents/FileIcon';
import { ReviewTips, TipsForDepartment } from './tips';
import { BarsOutlined, LinkOutlined, MoreOutlined, UserOutlined } from '@ant-design/icons';
import { AppCtx } from '../../../App';

const contentStyle = {
  fontSize: "1rem",
};
const labelStyle = {
  fontWeight: "500",
};
const descriptionStyle = {
  display: "block",
  maxHeight: "300px",
  overflow: "auto",
  whiteSpace: "break-spaces",
};


const IncidentInfo = ({ reportData }) => {
  const { sp_site } = useContext(AppCtx);
  const [showDetails, setShowDetails] = React.useState(false);
  const detailsRef = React.useRef(null);

  const handleToggleDetails = () => {
    setShowDetails(!showDetails);
    detailsRef.current.style.display = showDetails ? "none" : "block";
  }
  return (
    <div style={{ maxWidth: 1600, margin: '0 auto' }}>
      <div className='info-section-container'>
        <div className='infos'>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span></span>
            <span className='close-btn'><Button onClick={handleToggleDetails}>{<MoreOutlined />}</Button></span>
          </div>
          <Descriptions size='small' labelStyle={labelStyle} contentStyle={contentStyle} layout="vertical" bordered column={{ xxl: 3, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }} >
            <Descriptions.Item label={<><AiOutlineNumber /> Operational Incident NO.</>}>{reportData?.Number || ' - '}</Descriptions.Item>
            <Descriptions.Item label={<><TbCalendarMinus /> Reporting Date</>}>{moment(reportData?.CreatedAt).format('YYYY-MM-DD HH:mm') || ' - '}</Descriptions.Item>
            <Descriptions.Item label={<><TbCalendarMinus /> Incident Date</>}>{moment(reportData?.IncidentDate).format('YYYY-MM-DD') || ' - '}</Descriptions.Item>
            <Descriptions.Item label={<><TbCalendarMinus /> Discovery Date</>}>{moment(reportData?.DiscoveryDate).format('YYYY-MM-DD') || ' - '}</Descriptions.Item>
          </Descriptions>
          <br />
          <Descriptions size='small' labelStyle={labelStyle} contentStyle={contentStyle} layout="vertical" bordered column={{ xxl: 3, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
            <Descriptions.Item label={<><MdEmojiFlags /> Country</>}>{reportData?.Country || ' - '}</Descriptions.Item>
            <Descriptions.Item label={<><BiMoney /> Has Financial Impact</>}>{reportData?.HasFinancialImpact ? 'True' : 'False' || ' - '}</Descriptions.Item>
            {reportData?.HasFinancialImpact && <Descriptions.Item label={<><BiMoney /> Financial Impact</>}>{reportData?.FinancialImpactType || ' - '}</Descriptions.Item>}
            <Descriptions.Item label={<><BiMoney /> Amount (SAR)</>}>{reportData?.Amount || ' 0 '}</Descriptions.Item>
            <Descriptions.Item label={<><RiSkullLine /> Risk Type</>}>{riskType?.filter(r=> r.Type == reportData.RiskType)[0]?.Name || ' - '}</Descriptions.Item>
            <Descriptions.Item label={<><RiFileList3Line /> Incident Type</>}>{riskType?.filter(r=> r.Type == reportData.RiskType)[0]?.Incident?.filter(x=> x.id == reportData.IncidentType)[0]?.name || ' - '}</Descriptions.Item>
          </Descriptions>
          <br />
          <Descriptions size='small' labelStyle={labelStyle} contentStyle={contentStyle} layout="vertical" bordered>
            <Descriptions.Item contentStyle={descriptionStyle} label={<><FiFileText /> Descriptions</>} span={1}>{<div dangerouslySetInnerHTML={{ __html: reportData?.Descriptions || ' - ' }}></div>}</Descriptions.Item>
          </Descriptions>
        </div>

        <div className='details' ref={detailsRef}>
          <Section SectionTitle={<><UserOutlined /> Requester</>}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 45, height: 45, borderRadius: 99, overflow: 'hidden', }}>
                <img src={`${sp_site}/_layouts/15/userphoto.aspx?size=s&username=${reportData?.Requester?.Mail}`} width='100%' alt='' />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                <span style={{ fontWeight: 500, fontSize: '1.1rem', }} title='Display Name'>
                    {reportData?.Requester?.DisplayName}
                  </span>
                <span style={{ fontSize: '0.8rem', color: '#555', }} title='Deparment'>
                  {reportData?.Requester?.Department}
                </span>
              </div>
            </div>
          </Section>
          <Section SectionTitle={<><LinkOutlined /> Attached Files</>}>
            <div className='attachments-container'>
              {reportData?.Files?.map((file,i) => (
                <a target='_blank' href={`https://dev.salic.com/File/${file?.Guid}`} style={{ display: 'flex', alignItems: 'center', gap: 2, padding: 5 }}>
                  <FileIcon
                    key={i} 
                    FileType={file?.FileName?.split(".")[file?.FileName?.split(".")?.length-1]}
                    FileName={file?.FileName}
                    FilePath={`https://dev.salic.com/File/${file?.Guid}`}
                    IconWidth='22px'
                  />
                  <span style={{ color: '#555'}}>{file?.FileName}</span>
                </a>
                )
              )}
              {
                reportData?.Files?.length === 0
                ? <Typography.Text>No attachments for this ticket</Typography.Text>
                : null
              }
            </div>
          </Section>
          <Section SectionTitle={<><BarsOutlined /> Tips</>}>
            <List
              size="small"
              dataSource={
                ["PENDING_WITH_DEPARTMENT", "ForApproval", "CLOSED"].includes(reportData?.Status)
                ? TipsForDepartment
                : ReviewTips
              }
              renderItem={(item) => <List.Item style={{padding: '6px 0'}}>{item}</List.Item>}
            />
          </Section>
        </div>
      </div>
    </div>
  )
}

export default IncidentInfo