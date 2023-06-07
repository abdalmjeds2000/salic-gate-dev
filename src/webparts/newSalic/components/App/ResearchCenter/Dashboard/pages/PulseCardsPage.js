import React, { useEffect, useState, useContext } from 'react'
import { Button, Col, Row, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { AppCtx } from '../../../App';
import HistoryNavigation from '../../../Global/HistoryNavigation/HistoryNavigation';
import Card from '../components/Card/Card';
import pnp from 'sp-pnp-js';
import AntdLoader from '../../../Global/AntdLoader/AntdLoader';
import { CaretDownOutlined } from '@ant-design/icons';


function PulseCardsPage() {
  const { defualt_route, allPulseData, setAllPulseData } = useContext(AppCtx);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const _pageSize = 24;
  // const [currentPage, setCurrentPage] = useState(1);
  // const [itemsCount, setItemsCount] = useState(0);


  const FetchData = async () => {
    await pnp.sp.web.lists.getByTitle('Research Pulse')
      .items.orderBy('Created', false)
      .select('AttachmentFiles,*').expand('AttachmentFiles')
      .top(_pageSize).getPaged()
      .then(response => {
        setAllPulseData(response);
        console.log(response);
      })
    setLoading(false);
  }
  useEffect(() => { FetchData(); }, []);


  const FetchNextData = async () => {
    setLoading(true);

    allPulseData.getNext().then(response => {
      console.log('response', response);
      setAllPulseData(prev => {
        response.results = [...prev.results, ...response.results]
        return response
      });
    });

    setLoading(false);
  }

  return (
    <>
      <HistoryNavigation>
        <a onClick={() => navigate(defualt_route + '/research-library')}>Research Library</a>
        <p>Pulse</p>
      </HistoryNavigation>

      
      <div className='standard-page'>
        <div style={{display: 'flex'}}>
          <div style={{width: '100%'}}>
            <Row justify="space-between" align="middle" wrap={true}>
              <Col span={24}>
                <Typography.Title level={2} style={{lineHeight: 2.5}}>Pulse</Typography.Title>
              </Col>
            </Row>
            {
              !loading
              ? (
                <Row gutter={[20, 20]}>
                  {
                    allPulseData.results?.map((pulse, i) => {
                      let _CardImg = '';
                      let _CardDocument = '';
                      pulse.AttachmentFiles?.forEach(file => {
                        if(["jpeg", "jpg", "png", "gif", "tiff", "raw", "webp", "avif", "bpg", "flif"].includes(file.FileName?.split('.')[file.FileName?.split('.').length-1]?.toLowerCase())) {
                          _CardImg = file?.ServerRelativePath?.DecodedUrl;
                        } else if(["pdf", "doc", "docx", "html", "htm","xls", "xlsx", "txt", "ppt", "pptx", "ods"].includes(file.FileName?.split('.')[file.FileName?.split('.').length-1]?.toLowerCase())) {
                          _CardDocument = file?.ServerRelativePath?.DecodedUrl;
                        }
                        if(_CardDocument === '' && pulse.AttachmentLink != null) _CardDocument = pulse.AttachmentLink
                      });
                      return (
                        <Col xs={24} sm={12} md={8} lg={6}>
                          <Card 
                            key={i} 
                            imgSrc={_CardImg} 
                            title={pulse.Title} 
                            openFile={() => _CardImg.length > 0 ? window.open(_CardDocument) : null} 
                            contentStyle={{background: 'linear-gradient(0deg,rgba(0,0,0,.80),transparent 80%)'}}
                          />
                        </Col>
                      )
                    })
                  }
                </Row>
              )
              : <AntdLoader />
            }


            <Row justify="center" style={{margin: '25px 0'}}>
              {allPulseData.hasNext ? <Button onClick={FetchNextData}><CaretDownOutlined /> Next</Button> : null}
            </Row>
          </div>
        </div>
      </div>
    </>
  )
}

export default PulseCardsPage