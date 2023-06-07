import React, { useContext, useRef } from 'react';
import { Button, Descriptions, message, Timeline, Typography } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { AppCtx } from '../../../../../../App';
import HistoryNavigation from '../../../../../../Global/HistoryNavigation/HistoryNavigation';
import Reply from '../../../../../../Global/RequestsComponents/Reply';
import SenderImg from '../../../../../../Global/RequestsComponents/SenderImg';
import moment from 'moment';
import Section from '../../../../../../Global/RequestsComponents/Section';
import AntdLoader from '../../../../../../Global/AntdLoader/AntdLoader';
import ToggleButton from '../../../../../../Global/ToggleButton';
import { CgMoreO } from 'react-icons/cg';
import axios from 'axios';
import UpdateAssetForm from './UpdateAssetForm';
import FileIcon from '../../../../../../Global/RequestsComponents/FileIcon';
import ReturnAsset from './ReturnAsset';
import Preview from '../DeliveryLetters/Preview';

const { Title, Text } = Typography;



function ManageAsset() {
  let { id } = useParams();
  const { user_data, defualt_route } = useContext(AppCtx);
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [assetData, setAssetData] = React.useState({});
  

  // Get Asset by {id}
  async function GetAssetById() {
    setLoading(true);
    const { data } = await axios.get(`https://dev.salic.com/api/Asset/GetById?Email=${user_data?.Data?.Mail}&Id=${id}`)
    setAssetData(data.Data);
    setLoading(false);
  } 
  
  React.useEffect(() => {
    if(Object.keys(user_data).length > 0) {
      if(id) {
        GetAssetById();
      } else {
        navigate(defualt_route + '/asset/all');
        message.info("Error ::: Not Found Asset")
      }
    }
  }, [user_data]);




  // Toggle Properties Section (show and hide in mobile size)
  const propertiesSectionRef = useRef();
  const handleShowDetails = (v) => {
    propertiesSectionRef.current.style.display = 
    propertiesSectionRef.current.style.display === "block" ? "none" : "block";
  }


  let SubDevicesRender = [];
  if (assetData.SubDevices && assetData.SubDevices !== ''){
    SubDevicesRender = JSON.parse(assetData.SubDevices);
  }
  
  document.title = `.:: SALIC Gate | ${assetData.Name || 'Manage Asset'} ::.`;



  return (
    <>
      <HistoryNavigation>
        <a onClick={() => navigate(`${defualt_route}/asset/all`)}>SALIC's Assets</a>
        <p>{assetData.Name}</p>
      </HistoryNavigation>
      
      <div className='preview-request-container'>
        <div className="header">
          <h1>Asset SN# {assetData.SN}</h1>
          <div>
            <ReturnAsset assetData={assetData} onSuccessReturn={GetAssetById} />
            <span className='properties-toggle-btn'>
              <ToggleButton 
                icon={<CgMoreO />}
                title="more information"
                callback={handleShowDetails}
              />
            </span>
          </div>
        </div>

        <div className='content'>
          {
            !loading
            ? (
              <>
                <div className='timeline'>
                  <Timeline>
                    <div className="delivery-note-reply">
                      <Timeline.Item dot={<SenderImg Email={assetData?.CreatedBy?.Mail} Name={assetData?.CreatedBy?.DisplayName} />}>
                        <Reply 
                          Title={<>{assetData?.Name}</>} 
                          Description={<>{assetData.CreatedBy.DisplayName} @ {moment(assetData.CreatedAt).format('MM/DD/YYYY hh:mm A')}</>}
                        >
                          {assetData?.Description?.trim() && assetData?.Description?.trim()?.length > 0 ? <div dangerouslySetInnerHTML={{__html: assetData?.Description}}></div> : ''}
                          <br />
                          
                          <div>
                            <Descriptions bordered title={SubDevicesRender.length > 0 ? "Sub Devices" : null} size="small" column={1}>
                              {
                                SubDevicesRender.length > 0 
                                ? SubDevicesRender.map((item, i)=> {
                                    return <Descriptions.Item label={`${i+1}`}>{item.name} {item.tag} {item.sn}</Descriptions.Item>
                                  })
                                : null
                              }
                              <Descriptions.Item label="Attached Files">
                                <div style={{display: 'flex', gap: 7, flexWrap: 'wrap'}}>
                                  {
                                    assetData.Files.length > 0 
                                    ? assetData.Files.map((file ,i) => {
                                        return (
                                          <FileIcon
                                            key={i} 
                                            FileType={file.FileName.split(".")[file.FileName.split(".").length-1]}
                                            FileName={file.FileName}
                                            FilePath={`https://dev.salic.com/File/${file.Guid}`}
                                            IconWidth='45px'
                                          />
                                        )
                                      })
                                    : "No Image Uploaded"
                                  }
                                </div>
                              </Descriptions.Item>
                            </Descriptions>
                          </div> 
                        </Reply>
                      </Timeline.Item>
                    </div>

                    {
                      assetData.DeliveryNotes?.map((item, i) => {
                        let _itemReturn = null;
                        if (item.Return.length > 0){
                          let _return = item.Return[0];
                          let duration = moment.duration(moment(_return.CreatedAt).diff(moment(item.CreatedAt)));
                          let files = JSON.parse(_return.Attachments);
                          const _returnAttachments = [];
                          if(files != null && Object.keys(files).length != 0){
                            files.forEach(element => {
                              let path = 'https://dev.salic.com/File/'+element;
                              _returnAttachments.push({
                                fileType: element?.split(".")[element?.split(".")?.length-1],
                                fileName: element,
                                path: path,
                              })
                            });
                          }
                          _itemReturn = (
                            <div className='return-asset-reply'>
                              <Timeline.Item dot={<SenderImg Email={_return.ByUser.Mail} Name={_return.ByUser.DisplayName} />}>
                                <Reply 
                                  Title={<>Returned By : Mr/s. {_return.ByUser.DisplayName}</>} 
                                  Description={<span>{moment(_return.CreatedAt).format('MM/DD/YYYY hh:mm A')}, Duration : {Math.ceil(duration.asDays())} days</span>}
                                  Files={_returnAttachments}
                                >
                                  <Descriptions bordered size="small" column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }} >
                                    <Descriptions.Item label="Notes">{_return.Notes || ' - '}</Descriptions.Item>
                                    <Descriptions.Item label="Status">{_return.Status || ' - '}</Descriptions.Item>
                                    <Descriptions.Item label="Reason">{_return.Reason || ' - '}</Descriptions.Item>
                                  </Descriptions>
                                </Reply>
                              </Timeline.Item>
                            </div>
                          )
                        }
                        return (
                          <div>
                            <Timeline.Item key={i} dot={<SenderImg Email={item.ToUser.Mail} Name={item.ToUser.DisplayName} />}>
                              <Reply 
                                Title={<>Delivered To : Mr/s. {item.ToUser.DisplayName}</>} 
                                Description={<div>by {item.ByUser.DisplayName}, @ {moment(item.CreatedAt).format('MM/DD/YYYY hh:mm A')}</div>}
                              >
                                <div>
                                  <Text>As apart of delivery letter# <Preview id={item.DeliveryNoteId} btnLabel={String("0000" + item.DeliveryNoteId).slice(-4)} /></Text>
                                </div>
                              </Reply>
                            </Timeline.Item>
                            {_itemReturn}
                          </div>
                        )
                      })
                    }
                  </Timeline>
                </div>

                <div className='properties' ref={propertiesSectionRef}>
                  <Section SectionTitle="Asset Information">
                    <UpdateAssetForm data={assetData} onSuccessUpdate={GetAssetById} />
                  </Section>
                </div>
              </>
            ) : (
              <AntdLoader />
            )
          }
        </div>
      </div>
    </>
    
  )
}

export default ManageAsset