import React, { useState, useContext, useEffect} from 'react';
import './ArticlePage.css';
import { useNavigate, useParams } from 'react-router-dom';
import { Divider, Image, message, Spin, Tag, Tooltip, Typography } from 'antd';
import { CalendarOutlined, LoadingOutlined, PaperClipOutlined } from '@ant-design/icons';
import HistoryNavigation from '../../../../Global/HistoryNavigation/HistoryNavigation';
import GetArticleById from '../../API/GetArticleById';
import { AppCtx } from '../../../../App';
import moment from 'moment';
import AntdLoader from '../../../../Global/AntdLoader/AntdLoader';


function ArticlePage() {
  const { id } = useParams();
  const { user_data, defualt_route } = useContext(AppCtx);
  const navigate = useNavigate()
  const [article, setArticle] = useState({});
  const [loading, setLoading] = useState(true);

  const FetchData = async () => {
    const response = await GetArticleById(id);
    document.title = `.:: SALIC Gate | ${response?.Title} ::.`;
    if(Object.keys(response).length > 1) {
      setArticle(response);
    } else {
      setArticle([]);
    }
    
    setLoading(false);
  }

  useEffect(() => {
    if(id) {
      FetchData();
    } else {
      navigate(defualt_route+'/research-library');
      message.error("Error | Research Article Not Found");
    }
  }, [user_data]);


  
  return (
    <>
    <HistoryNavigation>
      <a onClick={() => navigate(defualt_route+'/research-library')}>Research Center</a>
      <p>Preview Research</p>
    </HistoryNavigation>

    {
      !loading
      ? (
        <div className='article-page-container'>
          <div className='content'>
            <div className='img'>
              <Image src={article ? article?.AttachmentFiles[0]?.ServerRelativePath?.DecodedUrl : null} preview alt={article.Title} />
            </div>
            <div className='body'>
              <Typography.Title level={3}>{article.Title}</Typography.Title>
              <Typography.Text type="secondary">
                {/* by <b>{article.Author?.Title}</b>, at {moment(article.Created).format('MM/DD/YYYY hh:mm:ss')} */}
                {article.PublishedDate && <><CalendarOutlined /> Publish Date {moment(article.PublishedDate).format('MM/DD/YYYY')}</>}
              </Typography.Text>
              <br />
              { 
                article.FullReportLink && article.ShowReportLink && 
                <Typography.Link 
                  onClick={() => window.open(article.FullReportLink, '_blank')}>
                    <Tooltip title="Click to Open">
                      <PaperClipOutlined /> View Full Report
                    </Tooltip>
                </Typography.Link> 
              }
              <div className='research-article-paragraph'>
                <Typography.Text style={{fontSize: '1.2rem'}}>
                  <div dangerouslySetInnerHTML={{__html: article.Body}}></div>
                </Typography.Text>
              </div>

              <div style={{marginTop: 25}}>
              {
                article.Tags
                ? article.Tags.map((tag, i) => <Tag key={i} color="#108ee9">{tag}</Tag>)
                : null
              }
              </div>

              {
                article.Hyperlink != null && (
                  <>
                    <Divider />
                    <Typography.Text strong>Links:</Typography.Text>
                    { article.Hyperlink?.replace(/<[^>]*>/g, '')?.length > 0 && <div dangerouslySetInnerHTML={{__html: article.Hyperlink}}></div> }
                  </>
                )
              }
            </div>
          </div>
        </div>
        )
      : <AntdLoader />
    }
    </>
  )
}

export default ArticlePage