import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppCtx } from '../../App';
import AntdLoader from '../../Global/AntdLoader/AntdLoader';
import HistoryNavigation from '../../Global/HistoryNavigation/HistoryNavigation';
import './NewsDetails.css';
import pnp from 'sp-pnp-js';
import moment from 'moment';



function NewsDetails() {
  let { id } = useParams();
  const { user_data, defualt_route } = useContext(AppCtx);
  const [newsData, setNewsData] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const fetchItem = async () => {
    setLoading(true);
    const response = await pnp.sp.web.lists.getByTitle('News').items.getById(id)
      .select('Author/Title,Author/EMail,Author/JobTitle,Subject,Photos,Id,ID,IsDraft,Description,CreatedOn,Created,IsPerson,AttachmentFiles')
      .expand('Author,AttachmentFiles').get()
    setNewsData(response);
    document.title = `.:: SALIC Gate | ${response?.Subject} ::.`;
    setLoading(false);
  }
  useEffect(() => {
    if(!id || id == "null" || id == "undefined") {
      navigate(defualt_route);
    }
    if(Object.keys(user_data).length > 0) {
      fetchItem();
    }
  }, [user_data])


  return (
    <>
      <HistoryNavigation>
        <a onClick={() => navigate(`${defualt_route}/community-news`)}>Community News</a>
        <p>News Details</p>
      </HistoryNavigation>

      {
        !loading
        ? <div className='news-details-page-container'>
            <div className='news-details'>
              <div className='image'>
                <img className='news-img' src={newsData?.AttachmentFiles?.length > 0 ? newsData?.AttachmentFiles[0]?.ServerRelativeUrl : newsData?.Photos} alt='' />
              </div>
              <div className='content'>
                <h1 className='news-title'>{newsData?.Subject}</h1>
                <time>
                  <FontAwesomeIcon icon={faCalendarDays} /> &nbsp;
                  {moment.utc(newsData?.CreatedOn).local().format('MM/DD/YYYY hh:mm A')}
                </time>
                <div className='news-description' dangerouslySetInnerHTML={{__html: newsData?.Description}}></div>
              </div>
            </div>
          </div>
        : <AntdLoader />
      }
    </>
  )
}

export default NewsDetails