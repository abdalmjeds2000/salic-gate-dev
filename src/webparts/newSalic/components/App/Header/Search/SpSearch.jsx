import React, { useContext, useEffect, useState } from 'react';
import './searchStyle.css';
import { Col, notification, Pagination, Row, Tooltip, Typography } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { AppCtx } from '../../App';
import Result from './components/Result';
import { searchLocations } from './searchLocations'
import FileCardRow from '../../Global/FileCard/FileCardRow';
import FileIcon from '../../Global/RequestsComponents/FileIcon';
import GetMyItServiceRequests from '../../9Boxs/ITServices/API/GetMyItServiceRequests';
import GetITRequestsAssignedForMe from '../../9Boxs/ITServices/API/GetITRequestsAssignedForMe';


const boxsPagesRoutes = ['/hc-services', '/admin-services', '/services-requests', '/e-invoicing', '/content-requests', '/research-requests', '/book-meeting-room', '/oracle-reports', '/power-bi-dashboards', '/power-bi-dashboards/human-capital', '/power-bi-dashboards/research', '/incidents-center'];


const SpSearch = ({ query, setShowSearch }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [researchResultData, setResearchResultData] = useState([]);
  const [inAllSp, setInAllSp] = useState(false);
  const { 
    user_data,
    sp_context, 
    showSearchResult, setShowSearchResult,
    setGateNewsData,
    setITRequests,
    setAllResearchArticlesData,
    setAllPulseData,
    setAllCountryData,
    setAllKnowledgeData,
    setResearchRequestsData,
    setSalicAssetsData,
    setDeliveryLettersData,
    my_it_requests_data, 
    setMyItRequestsData,
    it_requests_assigned_for_me_data, 
    setItRequestsAssignedForMeData,
    setNewsList,
    setContentRequestsData,
    eSign_requests, setESignRequests,
    eSign_requests_you_signed_it, setESignRequestsYouSignedIt,
    setMyIncidentReports,
    setAssignedIncidentReports,
    setIncidentReportsForReview,
    setIsAppInSearch
  } = useContext(AppCtx);
  const [currentPage, setCurrentPage] = useState(1);
  const [textQuery, setTextQuery] = useState('');
  const _pageSize = 24;

  const getRoute = () => {
    // let path = document.location.pathname.split(".aspx");
    let path = document.location.href.split(".aspx");
    return path[path.length-1]
  }
  const currentRoute = getRoute();
  const matchRoute = searchLocations.filter(route => currentRoute === route.route)[0];

  useEffect(() => {
    if(currentRoute != "/home" && !matchRoute) {
      setShowSearch(false);
    } else {
      setShowSearch(true);
    }
  }, [currentRoute])
  // SEARCH FUNCTION
  const submitQuery = async (SearhcTerm, page, pageSize) => {
    const cRoute = getRoute();
    // console.log(matchRoute?.path);
    if(matchRoute && matchRoute.path?.length === 0) {
      matchRoute?.fetchData(SearhcTerm)
      .then(async (response) => {
        console.log('newww seaech response =====> ', response);
        setIsAppInSearch(true);
        if(matchRoute.route == "/research-library") {
          setResearchResultData(response);
          setShowSearchResult(true);
          setInAllSp(false);
        } else if(matchRoute.route == "/community-news") {
          setGateNewsData(response);
        } else if(matchRoute.route == "/manage-news-content") {
          setNewsList(response);
        } else if(matchRoute.route == "/services-requests/service-requests-dashboard#2") {
          setITRequests(response.data?.data);
        } /* else if(matchRoute.route == "/research-library/categories/all") {
          setAllResearchArticlesData(response);
        } */ else if(matchRoute.route == "/research-library/categories/Commodity") {
          setAllResearchArticlesData(response);
        } else if(matchRoute.route == "/research-library/categories/AdHoc") {
          setAllResearchArticlesData(response);
        } else if(matchRoute.route == "/research-library/pulse") {
          setAllPulseData(response);
        } else if(matchRoute.route == "/research-library/country") {
          setAllCountryData(response);
        } else if(matchRoute.route == "/research-library/knowledge") {
          setAllKnowledgeData(response);
        } else if(matchRoute.route == "/research-requests/my-research-requests") {
          setResearchRequestsData(response)
        } else if(matchRoute.route == "/research-requests/all-research-requests") {
          setResearchRequestsData(response)
        } else if(matchRoute.route == "/content-requests/my-content-requests") {
          setContentRequestsData(response)
        } else if(matchRoute.route == "/content-requests/all-content-requests") {
          setContentRequestsData(response)
        } else if(matchRoute.route == "/asset/all#2") {
          setSalicAssetsData(response);
        } else if(matchRoute.route == "/asset/all#3") {
          setDeliveryLettersData(response);
        } else if(matchRoute.route == "/services-requests/my-requests") {
          const filtered_it_requests_data = my_it_requests_data?.filter(row => {
            const searchWord = SearhcTerm?.toLowerCase();
            if(
                row.Subject?.toLowerCase().includes(searchWord) || 
                row.Id?.toString().includes(searchWord) || 
                row.Priority?.toLowerCase().includes(searchWord) ||
                row.Status?.toLowerCase().includes(searchWord)
              ) return true
                return false
          });
          setMyItRequestsData(filtered_it_requests_data);
        } else if(matchRoute.route == "/services-requests/requests-assigned-for-me") {
            const filtered_it_requests_data = it_requests_assigned_for_me_data?.filter(row => {
              const searchWord = SearhcTerm?.toLowerCase();
              if(query) {
                if(row.Priority == "1" && searchWord=="1") { row.Priority = "Normal" }
                else if(row.Priority == "2" && searchWord=="2") { row.Priority = "Critical" }
              }
              if(
                  row.Subject?.toLowerCase().includes(searchWord) || 
                  row.Id?.toString().includes(searchWord) || 
                  row.Priority?.toLowerCase().includes(searchWord) ||
                  row.Status?.toLowerCase().includes(searchWord) ||
                  row.RequestType?.toLowerCase().includes(searchWord)
                ) return true
                  return false
            });
          setItRequestsAssignedForMeData(filtered_it_requests_data);
        } else if(boxsPagesRoutes.includes(matchRoute.route)) {
          let titlesElements = document.getElementsByTagName("h3");
          var divsList = Array.prototype.slice.call(titlesElements);
          divsList.map(el => {
            if(el.innerHTML?.toLowerCase()?.includes(SearhcTerm.toLowerCase())) {
              el.style.backgroundColor = '#ffed00';
              el.style.borderRadius = '5px';
              el.style.padding = '0px 5px';
            } else {
              el.style.backgroundColor = 'transparent';
            }
          });
        } else if(matchRoute.route == "/eSignature-document#1" || matchRoute.route == "/eSignature-document") {
          const filteredData = eSign_requests.filter(row => {
            if(row?.EmailSubject?.toLowerCase()?.includes(SearhcTerm?.toLowerCase())) {
              return true
            } 
            return false
          })
          
          setESignRequests(filteredData);
        } else if(matchRoute.route == "/eSignature-document#2") {
          const filteredData = eSign_requests_you_signed_it.filter(row => {
            if(row?.Title?.toLowerCase()?.includes(SearhcTerm?.toLowerCase())) {
              return true
            } return false
          })
          setESignRequestsYouSignedIt(filteredData);
        } else if(matchRoute.route == "/incidents-center/my-reports") {
          const response = await axios.get(`https://dev.salic.com/api/Incidents/Get?Email=${user_data?.Data?.Mail}&draw=1&order[0][column]=0&order[0][dir]=asc&start=0&length=-1&search[value]=&search[regex]=false&SortBy=CreatedAt&Method=desc&query=${SearhcTerm}&_=1669561213357`);
          setMyIncidentReports(response.data.Data);
        } else if(matchRoute.route == "/incidents-center/assigned-reports") {
          const response = await axios.get(`https://dev.salic.com/api/Incidents/AssignedToMe?Email=${user_data?.Data?.Mail}&draw=1&order[0][column]=0&order[0][dir]=asc&start=0&length=-1&search[value]=&search[regex]=false&SortBy=CreatedAt&Method=desc&query=${SearhcTerm}&_=1669561303011`);
          setAssignedIncidentReports(response.data.Data);
        } else if(matchRoute.route == "/incidents-center/request-for-review") {
          const response = await axios.get(`https://dev.salic.com/api/Incidents/PendingForReview?draw=1&order[0][column]=0&order[0][dir]=asc&start=0&length=-1&search[value]=&search[regex]=false&SortBy=CreatedAt&Method=desc&query=${SearhcTerm}&_=1669559950875`);
          setIncidentReportsForReview(response.data.Data);
        }
      })

    } else if((matchRoute && matchRoute?.path?.length > 0) || cRoute == "/home") {
      const queryPath = matchRoute ? `& (${matchRoute.path.join(' OR ')})` : '';
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
            '__metadata': { 'type': 'Microsoft.Office.Server.Search.REST.SearchRequest' },
            'Querytext': SearhcTerm + queryPath,
            RowLimit: takeItems, 
            StartRow: skipItems, 
            SelectProperties: { results: ["Tags", "Body", "Title", "Path", "Size", "IsDocument","DefaultEncodingURL", "FileType", "HitHighlightedSummary", "HitHighlightedProperties", "AuthorOWSUSER", "owstaxidmetadataalltagsinfo", "Created", "UniqueID", "NormSiteID", "NormWebID", "NormListID", "NormUniqueID", "ContentTypeId", "contentclass", "UserName", "JobTitle", "WorkPhone", "SPSiteUrl", "SiteTitle", "CreatedBy", "HtmlFileType", "SiteLogo"] },          
            HitHighlightedProperties:  {
              results: ['Title']
            }
          } 
        }),
      });

      const resposeData = {
        title: '',
        TotalRows: response.data.PrimaryQueryResult.RelevantResults.TotalRowsIncludingDuplicates,
        data: response.data.PrimaryQueryResult.RelevantResults.Table.Rows,
      };
      notification.destroy();
      if(resposeData?.data?.length > 0) {
        console.log(resposeData);
        setData([resposeData]);
        setCurrentPage(page);
        setShowSearchResult(true);
        setInAllSp(true);
      } else {
        notification.destroy();
        notification.error({message: 'No Data Match!', placement: 'topRight'});
      }
    }
    setLoading(false);
  }

  // REMOVE SEARCH RESULTS
  const returnDefualt = () => {
    const currentRoute = getRoute();
    const matchRoute = searchLocations.filter(route => currentRoute === route.route)[0];
    if(matchRoute && matchRoute.path?.length === 0 && matchRoute?.fetchOriginalData) {
      if(matchRoute.route == "/research-library") {
        setResearchResultData([]);
        setShowSearchResult(false);
      } 
      matchRoute?.fetchOriginalData()
      .then(async (response) => {
        console.log('OoOoOOoOoOoOoOoOoOOooOOo =====> ', response);
        setIsAppInSearch(false);
        if(matchRoute.route == "/community-news") {
          setGateNewsData(response);
        } else if(matchRoute.route == "/manage-news-content") {
          setNewsList(response);
        } else if(matchRoute.route == "/services-requests/service-requests-dashboard") {
          const response = await axios.get(`https://dev.salic.com/api/tracking/Get?draw=3&order=Id%20desc&start=0&length=24&search[value]=&search[regex]=false&email=${user_data?.Data?.Mail}&query=&_=1668265007659`);
          setITRequests(response.data?.data);
        } /* else if(matchRoute.route == "/research-library/categories/all") {
          setAllResearchArticlesData(response);
        } */ else if(matchRoute.route == "/research-library/categories/Commodity") {
          setAllResearchArticlesData(response);
        } else if(matchRoute.route == "/research-library/categories/AdHoc") {
          setAllResearchArticlesData(response);
        } else if(matchRoute.route == "/research-library/pulse") {
          setAllPulseData(response);
        } else if(matchRoute.route == "/research-library/country") {
          setAllCountryData(response);
        } else if(matchRoute.route == "/research-library/knowledge") {
          setAllKnowledgeData(response);
        } else if(matchRoute.route == "/research-requests/my-research-requests") {
          setResearchRequestsData(response)
        } else if(matchRoute.route == "/research-requests/all-research-requests") {
          setResearchRequestsData(response)
        } else if(matchRoute.route == "/content-requests/my-content-requests") {
          setContentRequestsData(response)
        } else if(matchRoute.route == "/content-requests/all-content-requests") {
          setContentRequestsData(response)
        } else if(matchRoute.route == "/asset/all#2") {
          setSalicAssetsData(response);
        } else if(matchRoute.route == "/asset/all#3") {
          setDeliveryLettersData(response);
        } else if(matchRoute.route == "/services-requests/my-requests") {
          const defualtData = await GetMyItServiceRequests(user_data.Data?.Mail);
          setMyItRequestsData(defualtData.data.Data);
          console.log(defualtData);
        } else if(matchRoute.route == "/services-requests/requests-assigned-for-me") {
          const defualtData = await GetITRequestsAssignedForMe(user_data.Data?.Mail);
          setItRequestsAssignedForMeData(defualtData.data.Data);
        } else if(boxsPagesRoutes.includes(matchRoute.route) /* Highlight in boxs paged */) {
          let titlesElements = document.getElementsByTagName("h3");
          var divsList = Array.prototype.slice.call(titlesElements);
          divsList.map(el => {
            el.style.backgroundColor = 'transparent';
          });
        } else if(matchRoute.route == "/eSignature-document#1" || matchRoute.route == "/eSignature-document") {
          const response = await axios.get(`https://dev.salic.com/api/signature/MyRequests?Email=${user_data?.Data?.Mail}`)
          setESignRequests(response.data?.Data);
        } else if(matchRoute.route == "/eSignature-document#2") {
          const response = await axios.get(`https://dev.salic.com/api/signature/AllRequests?Email=${user_data?.Data?.Mail}`)
          setESignRequestsYouSignedIt(response.data?.Data);
        } else if(matchRoute.route == "/incidents-center/my-reports") {
          const response = await axios.get(`https://dev.salic.com/api/Incidents/Get?Email=${user_data?.Data?.Mail}&draw=1&order[0][column]=0&order[0][dir]=asc&start=0&length=-1&search[value]=&search[regex]=false&SortBy=CreatedAt&Method=desc&query=&_=1669561213357`);
          setMyIncidentReports(response.data.Data);
        } else if(matchRoute.route == "/incidents-center/assigned-reports") {
          const response = await axios.get(`https://dev.salic.com/api/Incidents/AssignedToMe?Email=${user_data?.Data?.Mail}&draw=1&order[0][column]=0&order[0][dir]=asc&start=0&length=-1&search[value]=&search[regex]=false&SortBy=CreatedAt&Method=desc&query=&_=1669561303011`);
          setAssignedIncidentReports(response.data.Data);
        } else if(matchRoute.route == "/incidents-center/request-for-review") {
          const response = await axios.get(`https://dev.salic.com/api/Incidents/PendingForReview?draw=1&order[0][column]=0&order[0][dir]=asc&start=0&length=-1&search[value]=&search[regex]=false&SortBy=CreatedAt&Method=desc&query=&_=1669559950875`);
          setIncidentReportsForReview(response.data.Data);
        } else if(matchRoute.route == "/services-requests/service-requests-dashboard#2") {
          setITRequests(response.data?.data);
        }
      })
    } else {
      setShowSearchResult(false);
      setData([]);
    }

  }

  const pageCount = data[0]?.TotalRows;

  const onchangeQuery = (value) => {
    setTextQuery(value);
    if(value.trim().length === 0) {
      returnDefualt();
    } else if(value.trim().length >= 3) { 
      submitQuery(value, 1, _pageSize);
    } else { null }
  }
  useEffect(() => {onchangeQuery(query)}, [query])
  return (
    <>
      <div className='result-container' style={{width: 'calc(100vw - 50px)', visibility: showSearchResult ? "visible" : "hidden"}}>
          <Tooltip title="Close Search">
            <span 
              className='closeBtn' 
              onClick={() => {
                setShowSearchResult(false);
                setData([]);
                setTextQuery('');
              }}
            >
              <CloseCircleOutlined />
            </span>
          </Tooltip>
          {
            inAllSp
              ? <>
                <Result data={data} query={textQuery} showTotalRows={true} />
                  {pageCount > _pageSize && 
                    <Row justify="center">
                      <Col>
                        <Pagination
                          current={currentPage}
                          total={pageCount}
                          onChange={(page) => submitQuery(textQuery, page, _pageSize)}
                          pageSize={_pageSize}
                          showTitle
                        />
                      </Col>
                    </Row>
                  }
                </>
              : null
          }


          {
            !loading && !inAllSp
              ? (
                <div style={{padding: '40px 0 0 0', height: '100%', position: 'relative', overflowX: 'auto'}}>
                  {
                    researchResultData?.map((section, i) => {
                      return (
                        section.data?.length > 0
                        ? (
                          <Row key={i} gutter={[0, 8]} justify="center" style={{maxHeight: 'calc(100vh - 140px)', overflow: 'auto', padding: '5px', marginBottom: '20px'}}>
                            {section.title && <Col span={24}><Typography.Title level={3}>{section.title}</Typography.Title></Col>}
                            <Col span={24} style={{padding: '5px 10px 5px 62px', minWidth: '650px', display: 'flex', alignItems: 'center'}}>
                              <Typography.Text type='secondary' style={{width: '43.3%'}}>Name</Typography.Text>
                              <Typography.Text type='secondary' style={{width: '18.4%'}}>Created At</Typography.Text>
                            </Col>
                            {
                              section.data?.map((row, i) => {
                                return (
                                  <Col key={i} span={24}>
                                    <FileCardRow
                                      icon={<FileIcon FileType={null} FileName={row.Title} IconWidth={40} />}
                                      name={row.Title}
                                      createdDate={row.Created}
                                      // filePath={Path}
                                    />
                                  </Col>
                                )
                              })
                            }
                          </Row>
                        ) : (
                          null
                        )
                      )
                    })
                  }
                </div>
              ) : (
                null
              )
          }
      </div>
    </>
  )
}

export default SpSearch