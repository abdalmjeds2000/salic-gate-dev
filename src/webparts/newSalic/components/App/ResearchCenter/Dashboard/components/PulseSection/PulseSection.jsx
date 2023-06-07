import React, { useContext } from 'react';
import { Col, Row, Typography } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import Card from '../Card/Card';
import EmptySection from '../EmptySection/EmptySection';
import { useNavigate } from 'react-router-dom';
import { AppCtx } from '../../../../App';



function PulseSection({ sectionTitle, data }) {
  const { defualt_route } = useContext(AppCtx);
  const navigate = useNavigate();

  const slideBottom = () => {
    var newsSlider = document.getElementById(`pulse-section`);
    newsSlider.scrollTop = newsSlider.scrollTop + 160
  }
  
  return (
    <>
      <Row justify="space-between" align="middle">
        <Typography.Title level={3} style={{lineHeight: 2.5, whiteSpace: 'nowrap'}}>{sectionTitle}</Typography.Title>
        <Typography.Link onClick={() => navigate(defualt_route + `/research-library/pulse`)}>
          See All
        </Typography.Link>
      </Row>
      {
        data?.slice(0, 10)?.length !== 0 
        ? (
            <div id='pulse-section' className='research-scrollable-container'>
              <Row gutter={[20, 20]}>
              {
                data.map((pulse, i) => {
                  let _CardImg = '';
                  let _CardDocument = '';
                    pulse.AttachmentFiles?.forEach(file => {
                      if(["jpeg", "jpg", "png", "gif", "tiff", "raw", "webp", "avif", "bpg", "flif"].includes(file.FileName?.split('.')[file.FileName?.split('.').length-1]?.toLowerCase())) {
                        _CardImg = file?.ServerRelativePath?.DecodedUrl;
                      } else if(["pdf", "doc", "docx", "html", "htm","xls", "xlsx", "txt", "ppt", "pptx", "ods"].includes(file.FileName?.split('.')[file.FileName?.split('.').length-1]?.toLowerCase())) {
                        _CardDocument = file?.ServerRelativePath?.DecodedUrl;
                      }
                      if(_CardDocument === '' && pulse.AttachmentLink != null) _CardDocument = pulse.AttachmentLink
                    });
                  return (
                    // <Col xs={12} sm={12} md={12} lg={12}>
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <Card 
                        key={i} 
                        imgSrc={_CardImg} 
                        title={pulse.Title} 
                        imgCustomStyle={{height: '10.5rem'}}
                        openFile={() => _CardDocument.length > 0 ? window.open(_CardDocument) : null} 
                        contentStyle={{background: 'linear-gradient(0deg,rgba(0,0,0,.80),transparent 80%)'}}
                      />
                    </Col>
                  )
                  
                })
              }
              </Row>
              <DownOutlined onClick={slideBottom} className="bottom-scroll-icon arrow arrow-btm" />
            </div>
          )
        : <EmptySection />
      }
    </>
  )
}

export default PulseSection