import React, { useEffect, useState, useContext } from 'react'
import { Button, Col, Divider, Input, message, Row, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { AppCtx } from '../../../App';
import HistoryNavigation from '../../../Global/HistoryNavigation/HistoryNavigation';
import Card from '../components/Card/Card';
import pnp from 'sp-pnp-js';
import AntdLoader from '../../../Global/AntdLoader/AntdLoader';
import { SearchOutlined } from '@ant-design/icons';



function CountryCardsPage() {
  const { defualt_route, allCountryData, setAllCountryData } = useContext(AppCtx);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const FetchData = async () => {
    const items = await pnp.sp.web.lists.getByTitle('Research Country Outlook')
      .items.orderBy('Created', false)
      .select('AttachmentFiles,*')
      .expand('AttachmentFiles')
      .get();
    if(items?.length > 0) {
      setAllCountryData(items);
    }
    setLoading(false);
  }


  useEffect(() => { FetchData() }, []);




  let alphabetData = allCountryData?.reduce((r, e) => {
    // get first letter of name of current element
    let alphabet = e.Title?.trim()[0];
    // if there is no property in accumulator with this letter create it
    if (!r[alphabet]) r[alphabet] = { alphabet, record: [e] }
    // if there is push current element to children array for that letter
    else r[alphabet].record.push(e);
    // return accumulator
    return r;
  }, {});
  let alphabetDataSorted = Object.values(alphabetData).sort(function (a, b) {
    if (a.alphabet > b.alphabet) {
        return 1;
    }
    if (b.alphabet > a.alphabet) {
        return -1;
    }
    return 0;
  });

  return (  
    <>
      <HistoryNavigation>
        <a onClick={() => navigate(defualt_route + '/research-library')}>Research Library</a>
        <p>Country Outlook</p>
      </HistoryNavigation>

      <div className='standard-page'>
        <div style={{display: 'flex'}}>
          <div style={{width: '100%'}}>
            <Row justify="space-between" align="middle" wrap={true}>
              {/* <Col span={24} style={{maxWidth: '80%', margin: '0 auto', display: 'flex', alignItems: 'center'}}>
                <Input 
                  placeholder="Search by Title ( Min 3 Character)" 
                  size='large' 
                  addonBefore={<SearchOutlined />} 
                  onChange={e => {
                    e.target.value?.length >= 3 
                    ? (async () => {await ApplyFilter({Title: e.target.value})})() 
                    : null
                  }}
                />
                {isFilterData && <Button type="primary" size='large' danger onClick={() => {setIsFilterData(false); FetchData();} }>Remove Filter</Button>}
              </Col> */}
              <Col span={24}><Typography.Title level={2} style={{lineHeight: 2.5}}>Country Outlook</Typography.Title></Col>
            </Row>
            {
              !loading
              ? (
                  <Row gutter={[20, 20]}>
                    {
                      alphabetDataSorted.map((group) => {
                        return (
                          <>
                            <Col span={24}>
                              <Divider orientation="left" orientationMargin="0" style={{margin: 0, fontSize: '2.5rem'}}>{group.alphabet}</Divider>
                            </Col>
                            {
                              group.record?.map((country, i) => {
                                let _CardImg = '';
                                let _CardDocument = '';
                                country.AttachmentFiles?.forEach(file => {
                                  if(["jpeg", "jpg", "png", "gif", "tiff", "raw", "webp", "avif", "bpg", "flif"].includes(file.FileName?.split('.')[file.FileName?.split('.').length-1]?.toLowerCase())) {
                                    _CardImg = file?.ServerRelativePath?.DecodedUrl;
                                  } else if(["pdf", "doc", "docx", "html", "htm","xls", "xlsx", "txt", "ppt", "pptx", "ods"].includes(file.FileName?.split('.')[file.FileName?.split('.').length-1]?.toLowerCase())) {
                                    _CardDocument = file?.ServerRelativePath?.DecodedUrl;
                                  }
                                  if(_CardDocument === '' && country.AttachmentLink != null) _CardDocument = country.AttachmentLink
                                  });
                                return (
                                  <Col key={i} xs={24} sm={12} md={12} lg={8} xl={6} xxl={4}>
                                    <Card 
                                      imgSrc={_CardImg} 
                                      title={country.Title} 
                                      openFile={() => _CardImg.length > 0 ? window.open(_CardDocument) : null} 
                                    />
                                  </Col>
                                )
                              })
                            }
                          </>
                        )
                      })
                    }
                  </Row>
                )
              : <AntdLoader />
            }
            {/* {!isFilterData && !loading && <Row justify="center" style={{marginTop: 35}}>
              <Pagination
                currentPage={currentPage}
                totalPages={pageCount}
                onChange={(page) => FetchData(page, _pageSize)}
                limiter={24}
              />
            </Row>} */}
          </div>
        </div>
      </div>
    </>
  )
}

export default CountryCardsPage


