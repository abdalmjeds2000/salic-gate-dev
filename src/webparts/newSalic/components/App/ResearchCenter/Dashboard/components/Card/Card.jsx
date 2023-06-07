import React from 'react';
import { Typography } from 'antd';
import './Card.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';



function Card({ imgSrc, title, openFile, imgCustomStyle, contentStyle }) {
  return (
    <div className='custom-img-card' style={{...imgCustomStyle}} onClick={openFile}>
      <div className='card-container full-w-h' /* style={{backgroundImage: `url("${imgSrc}")`}} */>
        <LazyLoadImage
          alt=''
          effect="blur"
          width={200}
          src={imgSrc} />
        <div className='content' style={{...contentStyle}}>
          <Typography.Text strong style={{color: '#fff', fontSize: '1rem'}}>{title}</Typography.Text>
        </div>
      </div>
    </div>
  )
}

export default Card