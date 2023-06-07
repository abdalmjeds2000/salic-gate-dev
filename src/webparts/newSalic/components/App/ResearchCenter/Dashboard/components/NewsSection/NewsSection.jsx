import React from 'react';
import './NewsSection.css';
import { Typography } from 'antd';
import NewsItem from './NewsItem/NewsItem';
import { DownOutlined } from '@ant-design/icons';
import EmptySection from '../EmptySection/EmptySection';



function NewsSection({ sectionTitle, data }) {

  const slideBottom = () => {
    var newsSlider = document.getElementById(`research-news-slider`);
    newsSlider.scrollTop = newsSlider.scrollTop + 170
  }
  return (
    <>
      <Typography.Title level={3} style={{lineHeight: 2.5}}>{sectionTitle}</Typography.Title>
      {
        data?.length !== 0 || !data
        ? (
            <div id="research-news-slider" className='research-scrollable-container research-news-container'>
              {data?.map((article, i) => (
                <NewsItem key={i} body={article.Body} title={article.Title} createdDate={article.Created} />
              ))}
              <DownOutlined onClick={slideBottom} className="bottom-scroll-icon arrow arrow-btm" />
            </div>
          )
        : <EmptySection />
      }
    </>
  )
}

export default NewsSection