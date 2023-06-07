import React, { useContext } from 'react';
import './ResearchSection.css';
import MainArticle from './MainArticle/MainArticle';
import SecondaryArticles from './SecondaryArticles/SecondaryArticles';
import { Row, Typography } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import EmptySection from '../EmptySection/EmptySection';
import { useNavigate } from 'react-router-dom';
import { AppCtx } from '../../../../App';



function ResearchSection({sectionTitle, id, data, IsFeature, type}) {
  const { defualt_route } = useContext(AppCtx);
  const navigate = useNavigate();

  const slideLeft = () => {
    var slider = document.getElementById(`slider-${id}`);
    slider.scrollLeft = slider.scrollLeft - 175
  }
  const slideRight = () => {
    var slider = document.getElementById(`slider-${id}`);
    slider.scrollLeft = slider.scrollLeft + 175
  }

  let _mainCard = [];
  let _secondaryCards = [];

  if(data.length > 0 && IsFeature) {
    _mainCard = data?.filter(row => row.IsFeature != null)[0];
    _secondaryCards = data?.filter(row => row?.GUID != _mainCard?.GUID);
  } else if(data.length > 0 && !IsFeature) {
    //_mainCard = data?.filter(row => row.from === 'research')[0];
    _mainCard = data[0];
    _secondaryCards = data?.filter(row => row?.GUID != _mainCard?.GUID);
  } 

  const RenderMainCard = () => {
    if(_mainCard.from === 'pulse') {
      let _CardImg = '';
      let _CardDocument = '';
        _mainCard?.AttachmentFiles?.forEach(file => {
          if(["jpeg", "jpg", "png", "gif", "tiff", "raw", "webp", "avif", "bpg", "flif"].includes(file.FileName?.split('.')[file.FileName?.split('.').length-1]?.toLowerCase())) {
            _CardImg = file?.ServerRelativePath?.DecodedUrl;
          } else if(["pdf", "doc", "docx", "html", "htm","xls", "xlsx", "txt", "ppt", "pptx", "ods"].includes(file.FileName?.split('.')[file.FileName?.split('.').length-1]?.toLowerCase())) {
            _CardDocument = file?.ServerRelativePath?.DecodedUrl;
          }
          if(_CardDocument === '' && _mainCard?.AttachmentLink != null) _CardDocument = _mainCard?.AttachmentLink
        });
      return (
        <MainArticle 
          url={_CardDocument} 
          imgSrc={_CardImg} 
          title={_mainCard?.Title} 
        />
      )
    } else if(_mainCard.from === 'country') {
      let _CardImg = '';
      let _CardDocument = '';
        _mainCard.AttachmentFiles?.forEach(file => {
          if(["jpeg", "jpg", "png", "gif", "tiff", "raw", "webp", "avif", "bpg", "flif"].includes(file.FileName?.split('.')[file.FileName?.split('.').length-1]?.toLowerCase())) {
            _CardImg = file?.ServerRelativePath?.DecodedUrl;
          } else if(["pdf", "doc", "docx", "html", "htm","xls", "xlsx", "txt", "ppt", "pptx", "ods"].includes(file.FileName?.split('.')[file.FileName?.split('.').length-1]?.toLowerCase())) {
            _CardDocument = file?.ServerRelativePath?.DecodedUrl;
          }
          if(_CardDocument === '' && _mainCard.AttachmentLink != null) _CardDocument = _mainCard.AttachmentLink
        });
      return (
        <MainArticle 
          url={_CardDocument} 
          imgSrc={_CardImg} 
          title={_mainCard?.Title} 
        />
      )
    } else if(_mainCard.from === 'knowledge') {
      let _MainCardImg = '';
      let __MainCardDocument = '';
      Array.isArray(_mainCard?.AttachmentFiles) ? _mainCard?.AttachmentFiles?.forEach(file => {
        if(["jpeg", "jpg", "png", "gif", "tiff", "raw", "webp", "avif", "bpg", "flif"].includes(file.FileName?.split('.')[file.FileName?.split('.').length-1]?.toLowerCase())) {
          _MainCardImg = file?.ServerRelativePath?.DecodedUrl;
        } else if(["pdf", "doc", "docx", "html", "htm","xls", "xlsx", "txt", "ppt", "pptx", "ods"].includes(file.FileName?.split('.')[file.FileName?.split('.').length-1]?.toLowerCase())) {
          __MainCardDocument = file?.ServerRelativePath?.DecodedUrl;
        }
        if(__MainCardDocument === '' && _mainCard.AttachmentLink != null) __MainCardDocument = _mainCard.AttachmentLink
      }) : [];
      return (
        <MainArticle 
          url={__MainCardDocument} 
          imgSrc={_MainCardImg} 
          title={_mainCard?.Title} 
        />
      )
    } else /* if(article.from === 'research' || null)  */{
      return (
        <MainArticle 
          articleId={_mainCard?.Id} 
          imgSrc={_mainCard.AttachmentFiles[0]?.ServerRelativePath?.DecodedUrl} 
          title={_mainCard?.Title} 
        />
      )
    } 
  }

  return (
    <>
      <Row justify="space-between" align="middle">
        <Typography.Title level={3} style={{lineHeight: 2.5}}>{sectionTitle}</Typography.Title>
        <Typography.Link onClick={() => {
            if(type) {
              navigate(defualt_route + `/research-library/categories/${type}`);
            } else {
              navigate(defualt_route + `/research-library/categories/all`);
            }
          }
        }>
          See All
        </Typography.Link>
      </Row>
      <div className='research-section-container'>
      {
        data?.length !== 0
        ? (
            <>
              {/* <MainArticle 
                articleId={_mainCard?.Id} 
                imgSrc={_mainCard?.AttachmentFiles[0]?.ServerRelativePath?.DecodedUrl} 
                title={_mainCard?.Title} 
                body={_mainCard?.Body} 
              /> */}
              <RenderMainCard />
              <div className='secondary-articles-container'>
                { _secondaryCards?.length > 3 && <LeftOutlined onClick={slideLeft} className="prev-icon arrow" /> }
                <div id={`slider-${id}`} className='slider'>
                  {_secondaryCards?.map((article, i) => {
                    if(article.from === 'pulse') {
                      let _CardImg = '';
                      let _CardDocument = '';
                        article?.AttachmentFiles?.forEach(file => {
                          if(["jpeg", "jpg", "png", "gif", "tiff", "raw", "webp", "avif", "bpg", "flif"].includes(file.FileName?.split('.')[file.FileName?.split('.').length-1]?.toLowerCase())) {
                            _CardImg = file?.ServerRelativePath?.DecodedUrl;
                          } else if(["pdf", "doc", "docx", "html", "htm","xls", "xlsx", "txt", "ppt", "pptx", "ods"].includes(file.FileName?.split('.')[file.FileName?.split('.').length-1]?.toLowerCase())) {
                            _CardDocument = file?.ServerRelativePath?.DecodedUrl;
                          }
                          if(_CardDocument === '' && article?.AttachmentLink != null) _CardDocument = article?.AttachmentLink
                        });
                      return (
                        <SecondaryArticles 
                          key={i}
                          url={_CardDocument} 
                          imgSrc={_CardImg} 
                          title={article.Title}
                        />
                      )
                    } else if(article.from === 'country') {
                      let _CardImg = '';
                      let _CardDocument = '';
                        article.AttachmentFiles?.forEach(file => {
                          if(["jpeg", "jpg", "png", "gif", "tiff", "raw", "webp", "avif", "bpg", "flif"].includes(file.FileName?.split('.')[file.FileName?.split('.').length-1]?.toLowerCase())) {
                            _CardImg = file?.ServerRelativePath?.DecodedUrl;
                          } else if(["pdf", "doc", "docx", "html", "htm","xls", "xlsx", "txt", "ppt", "pptx", "ods"].includes(file.FileName?.split('.')[file.FileName?.split('.').length-1]?.toLowerCase())) {
                            _CardDocument = file?.ServerRelativePath?.DecodedUrl;
                          }
                          if(_CardDocument === '' && article.AttachmentLink != null) _CardDocument = article.AttachmentLink
                        });
                      return (
                        <SecondaryArticles 
                          url={_CardDocument} 
                          key={i} 
                          imgSrc={_CardImg} 
                          title={article.Title}
                        />
                      )
                    } else if(article.from === 'knowledge') {
                      let _CardImg = '';
                      let _CardDocument = '';
                        article.AttachmentFiles?.forEach(file => {
                          if(["jpeg", "jpg", "png", "gif", "tiff", "raw", "webp", "avif", "bpg", "flif"].includes(file.FileName?.split('.')[file.FileName?.split('.').length-1]?.toLowerCase())) {
                            _CardImg = file?.ServerRelativePath?.DecodedUrl;
                          } else if(["pdf", "doc", "docx", "html", "htm","xls", "xlsx", "txt", "ppt", "pptx", "ods"].includes(file.FileName?.split('.')[file.FileName?.split('.').length-1]?.toLowerCase())) {
                            _CardDocument = file?.ServerRelativePath?.DecodedUrl;
                          }
                          if(_CardDocument === '' && article.AttachmentLink != null) _CardDocument = article.AttachmentLink
                        });
                      return (
                        <SecondaryArticles 
                          key={i}
                          title={article?.Title}
                          imgSrc={_CardImg} 
                          url={_CardDocument} 
                        />
                      )
                    } else /* if(article.from === 'research')  */{
                      return (
                        <SecondaryArticles 
                          key={i} 
                          articleId={article?.Id} 
                          imgSrc={article.AttachmentFiles[0]?.ServerRelativePath?.DecodedUrl} 
                          title={article.Title}
                        />
                      )
                    } 
                  })}
                </div>
                { _secondaryCards?.length > 3 && <RightOutlined onClick={slideRight} className="next-icon arrow" /> }
              </div>
            </>
          )
        : <EmptySection />
      }
      </div>

    </>
  )
}

export default ResearchSection