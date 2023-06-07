import React, { useContext } from 'react';
import './KnowledgeSection.css';
import { Col, Row, Typography } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import EmptySection from '../EmptySection/EmptySection';
import { useNavigate } from 'react-router-dom';
import { AppCtx } from '../../../../App';
import Card from '../Card/Card';



function KnowledgeSection({sectionTitle, data}) {
  const { defualt_route } = useContext(AppCtx);
  const navigate = useNavigate();

  const slideLeft = () => {
    var slider = document.getElementById(`knowledge-slider`);
    slider.scrollLeft = slider.scrollLeft - 175
  }
  const slideRight = () => {
    var slider = document.getElementById(`knowledge-slider`);
    slider.scrollLeft = slider.scrollLeft + 175
  }

  let _mainCard = data?.filter(row => row.IsFeature !== null)[0];
  let _secondaryCards = data?.filter(row => row?.Id != _mainCard?.Id);

  let _MainCardImg = '';
  let __MainCardDocument = '';
  Array.isArray(_mainCard?.AttachmentFiles) ? _mainCard.AttachmentFiles?.forEach(file => {
    if(["jpeg", "jpg", "png", "gif", "tiff", "raw", "webp", "avif", "bpg", "flif"].includes(file.FileName?.split('.')[file.FileName?.split('.').length-1]?.toLowerCase())) {
      _MainCardImg = file?.ServerRelativePath?.DecodedUrl;
    } else if(["pdf", "doc", "docx", "html", "htm","xls", "xlsx", "txt", "ppt", "pptx", "ods"].includes(file.FileName?.split('.')[file.FileName?.split('.').length-1]?.toLowerCase())) {
      __MainCardDocument = file?.ServerRelativePath?.DecodedUrl;
    }
    if(__MainCardDocument === '' && _mainCard.AttachmentLink != null) __MainCardDocument = _mainCard.AttachmentLink
  }) : [];
  return (
    <>
      <Row justify="space-between" align="middle">
        <Typography.Title level={3} style={{lineHeight: 2.5}}>{sectionTitle}</Typography.Title>
        <Typography.Link onClick={() => navigate(defualt_route + `/research-library/knowledge`)}>
          See All
        </Typography.Link>
      </Row>


      <div className='knowledge-container'>
      {
        data?.length !== 0
        ? (
            <>
              <Row gutter={[20, 20]} align="middle">
                <Col xs={24} sm={24} md={24} lg={8}>
                  <Card 
                    imgSrc={_MainCardImg} 
                    title={_mainCard?.Title} 
                    imgCustomStyle={{height: '20rem'}}
                    openFile={() => __MainCardDocument.length > 0 ? window.open(__MainCardDocument) : null} 
                  />
                </Col>

                <Col xs={24} sm={24} md={24} lg={16}>
                  <div className='knowledge-slider-container'>
                    { _secondaryCards?.length > 3 && <LeftOutlined onClick={slideLeft} className="prev-icon arrow" /> }
                      <div id="knowledge-slider" className='knowledge-slider'>
                        {_secondaryCards?.map((card, i) => {
                          let _CardImg = '';
                          let _CardDocument = '';
                            card.AttachmentFiles?.forEach(file => {
                              if(["jpeg", "jpg", "png", "gif", "tiff", "raw", "webp", "avif", "bpg", "flif"].includes(file.FileName?.split('.')[file.FileName?.split('.').length-1]?.toLowerCase())) {
                                _CardImg = file?.ServerRelativePath?.DecodedUrl;
                              } else if(["pdf", "doc", "docx", "html", "htm","xls", "xlsx", "txt", "ppt", "pptx", "ods"].includes(file.FileName?.split('.')[file.FileName?.split('.').length-1]?.toLowerCase())) {
                                _CardDocument = file?.ServerRelativePath?.DecodedUrl;
                              }
                              if(_CardDocument === '' && card.AttachmentLink != null) _CardDocument = card.AttachmentLink
                            });
                          return (
                            <Card
                              key={i}
                              imgSrc={_CardImg} 
                              title={card.Title} 
                              imgCustomStyle={{minWidth: 'calc(100%/4 - 60px/4)', height: '13rem'}}
                              openFile={() => _CardDocument.length > 0 ? window.open(_CardDocument) : null} 
                            />
                          )
                          })}
                      </div>
                    { _secondaryCards?.length > 3 && <RightOutlined onClick={slideRight} className="next-icon arrow" /> }
                  </div>
                </Col>

              </Row>
            </>
          )
        : <EmptySection />
      }
      </div>

    </>
  )
}

export default KnowledgeSection