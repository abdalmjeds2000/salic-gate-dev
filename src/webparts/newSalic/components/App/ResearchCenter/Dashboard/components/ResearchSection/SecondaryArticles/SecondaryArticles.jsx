import React, { useContext } from 'react';
import './SecondaryArticles.css';
import { useNavigate } from 'react-router-dom';
import { AppCtx } from '../../../../../App';

function SecondaryArticles({ imgSrc, title, articleId, url }) {
  const { defualt_route } = useContext(AppCtx);
  const navigate = useNavigate();

  return (
    <div 
      className='secondary-article' 
      onClick={() => articleId ? navigate(defualt_route+'/research-library/'+articleId) : url ? window.open(url) : null}>
      <div className="article-img small" style={{backgroundImage: `url("${imgSrc}")`}}>
        <div className='label'>{title}</div>
        {/* <div className='content'>
          <Typography.Title level={5} style={{lineHeight: '1.3 !important', fontSize: '0.9rem'}}>
            {title}
          </Typography.Title>
        </div> */}
      </div>
    </div>
  )
}

export default SecondaryArticles