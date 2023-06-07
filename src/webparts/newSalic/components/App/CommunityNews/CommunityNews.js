import React, { useContext, useEffect, useState } from 'react';
import './CommunityNews.css';
import ArticleBox from '../Global/ArticleBox/ArticleBox';
import { AppCtx } from '../App';
import HistoryNavigation from '../Global/HistoryNavigation/HistoryNavigation';
import { Pagination, Row } from 'antd';
import pnp from 'sp-pnp-js';
import AntdLoader from '../Global/AntdLoader/AntdLoader';


function CommunityNews() {
  const { gateNewsData, setGateNewsData } = useContext(AppCtx);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredNewslist, setFilteredNewslist] = useState([]);
  const [loading, setLoading] = useState(true);
  const _pageSize = 25;

  const fetchData = async () => {
    setLoading(true);
    const response = await pnp.sp.web.lists.getByTitle('News').items
      .select('Author/Title,Author/EMail,Author/JobTitle,AttachmentFiles,*').expand('Author,AttachmentFiles').top(500)
      .orderBy("CreatedOn", false).filter("IsDraft eq '0'").get()
    setGateNewsData(response);
    setLoading(false);
  }



  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    setFilteredNewslist(gateNewsData.slice(0, _pageSize))
  }, [gateNewsData]);
  

  
  if(loading) {
    return <AntdLoader />
  }
  return (
    <div className='community-news-page-container'>
      <HistoryNavigation>
        <p>Community News</p>
      </HistoryNavigation>

      <h1>Community News</h1>
      <div className='news-boxs'>
        {filteredNewslist?.map((box, i) => {
          return (
            <ArticleBox 
              key={i}
              Title={box.Subject}
              Description ={box.Description?.replace(/<[^>]*>?/gm, '').replace(/&(nbsp|amp|quot|lt|gt);/g, "")}
              Poster={box.AttachmentFiles.length > 0 ? box.AttachmentFiles[0]?.ServerRelativeUrl : box.Photos}
              To={`/community-news/${box.Id}`}
            />
          )
        })}
      </div>


      <Row justify="center" style={{margin: 25}}>
        <Pagination
          current={currentPage}
          total={gateNewsData.length}
          onChange={(page) => {
            const skipItems = _pageSize * (page - 1);
            setCurrentPage(page);
            setFilteredNewslist(gateNewsData.slice(skipItems, skipItems+_pageSize));
          }}
          pageSize={_pageSize}
          showTitle
        />
      </Row>
    </div>
  )
}

export default CommunityNews