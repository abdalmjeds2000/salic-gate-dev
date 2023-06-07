import React, { useContext } from 'react';
import { Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { AppCtx } from '../../../../../App';


function MainArticle({ imgSrc, title, body, articleId, url }) {
  const { defualt_route } = useContext(AppCtx);
  const navigate = useNavigate();

  return (
    <div className='main-article' 
    onClick={() => articleId ? navigate(defualt_route+'/research-library/'+articleId) : url ? window.open(url) : null}>
      <div className="article-img" style={{backgroundImage: `url("${imgSrc}")`}}>
        <div className='label'>{title}</div>
        <div className='content'>
          <Typography.Title ellipsis={{rows: 1, expandable: false}} level={4}>
            {title}
          </Typography.Title>
          <Typography.Paragraph ellipsis={{rows: 7, expandable: false}}>
            <div dangerouslySetInnerHTML={{__html: body?.replace(/<[^>]*>/g, '')}}></div>
          </Typography.Paragraph>
        </div>
      </div>
    </div>
  )
}

export default MainArticle