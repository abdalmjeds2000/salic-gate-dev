import React, { useContext, useState } from 'react';
import './searchStyle.css';
import HistoryNavigation from '../Global/HistoryNavigation/HistoryNavigation';
import Header from './components/Header';
import Result from './components/Result';
import axios from 'axios';
import { AppCtx } from '../App';
import { message } from 'antd';



function SPSearch() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const { sp_context } = useContext(AppCtx);
  const _pageSize = 24;
  const [currentPage, setCurrentPage] = useState(1);
  const [textQuery, setTextQuery] = useState('');
  


  const submitQuery = async (SearhcTerm, page, pageSize) => {
    const skipItems = pageSize * (page - 1);
    const takeItems = pageSize;

    setLoading(true);
    const cntxtX = await axios.post(`${sp_context.pageContext.web.absoluteUrl}/_api/contextinfo`);
    const response = await axios({
      method: 'POST',
      url: `${sp_context.pageContext.web.absoluteUrl}/_api/search/postquery`,
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json;odata=verbose",
        "X-RequestDigest": cntxtX.data.FormDigestValue,
      },
      data: JSON.stringify({ 
        'request': { 
          Querytext: SearhcTerm, 
          RowLimit: takeItems, 
          StartRow: skipItems, 
          SelectProperties: { results: ["Title", "Path", "Size", "IsDocument","DefaultEncodingURL", "FileType", "HitHighlightedSummary", "HitHighlightedProperties", "AuthorOWSUSER", "owstaxidmetadataalltagsinfo", "Created", "UniqueID", "NormSiteID", "NormWebID", "NormListID", "NormUniqueID", "ContentTypeId", "contentclass", "UserName", "JobTitle", "WorkPhone", "SPSiteUrl", "SiteTitle", "CreatedBy", "HtmlFileType", "SiteLogo"] }
        } 
      }),
    });

    const resposeData = response.data.PrimaryQueryResult.RelevantResults;
    if(resposeData.Table.Rows.length > 0) {
      console.log(resposeData);
      setData(resposeData);
      setCurrentPage(page);
    } else {
      message.destroy();
      message.info("No Data Match!")
    }

    setLoading(false);
  }


  const pageCount = Math.ceil(data.TotalRowsIncludingDuplicates / _pageSize);
  let prevSearchQuery = '';

  
  return (
    <>
      <HistoryNavigation>
        <p>Modern Search</p>
      </HistoryNavigation>


      <div className='search-page'>  
        <Header 
          handleSearch={value => {
            if(value != prevSearchQuery) {prevSearchQuery = value; submitQuery(value, 1, _pageSize); setTextQuery(value);}
          }} />
        <div className='result-container'>
          {
            data.Table?.Rows?.length > 0 
            ? <>
                <Result data={data.Table.Rows} totalItems={data.TotalRowsIncludingDuplicates} query={textQuery} />
                {/* {pageCount > 1 && <Pagination
                  currentPage={currentPage}
                  totalPages={pageCount}
                  onChange={(page) => submitQuery(textQuery, page, _pageSize)}
                  limiter={3}
                  hideFirstPageJump
                  hideLastPageJump
                />} */}
              </>
            : null
          }
        </div>
      </div>
    </>
  )
}

export default SPSearch