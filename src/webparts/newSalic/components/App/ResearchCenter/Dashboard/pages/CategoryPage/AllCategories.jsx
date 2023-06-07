import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppCtx } from '../../../../App';
import HistoryNavigation from '../../../../Global/HistoryNavigation/HistoryNavigation';
import pnp from 'sp-pnp-js';
import { Button, Col, Row, Typography } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import Card from '../../components/Card/Card';
import AntdLoader from '../../../../Global/AntdLoader/AntdLoader';


const AllCategories = () => {
  const { defualt_route } = useContext(AppCtx);
  const navigate = useNavigate();
  const [researchData, setResearchData] = useState({results: []});
  const [pulseData, setPulseData] = useState({results: []});
  const [countryData, setCountryData] = useState({results: []});
  const [knowledgeData, setKnowledgeData] = useState({results: []});
  const [loading, setLoading] = useState(true);

  const _pageSize = 8;

  const fetchData = async () => {
    await pnp.sp.web.lists.getByTitle('Research Articles')
      .items.orderBy('Created', false)
      .select('AttachmentFiles,*').expand('AttachmentFiles')
      .top(_pageSize).getPaged()
      .then(response => {
        setResearchData(response);
      })
    await pnp.sp.web.lists.getByTitle('Research Pulse')
      .items.orderBy('Created', false)
      .select('AttachmentFiles,*').expand('AttachmentFiles')
      .top(_pageSize).getPaged()
      .then(response => {
        setPulseData(response);
      })
    await pnp.sp.web.lists.getByTitle('Research Country Outlook')
      .items.orderBy('Created', false)
      .select('AttachmentFiles,*').expand('AttachmentFiles')
      .top(_pageSize).getPaged()
      .then(response => {
        setCountryData(response);
      })
    await pnp.sp.web.lists.getByTitle('Knowledge Center')
      .items.orderBy('Created', false)
      .select('AttachmentFiles,*').expand('AttachmentFiles')
      .top(_pageSize).getPaged()
      .then(response => {
        setKnowledgeData(response);
      })
    setLoading(false);
  }


  useEffect(() => { fetchData(); }, []);


  const fetchNextData = async () => {
    setLoading(true);
    if(researchData.hasNext) {
      researchData?.getNext()?.then(response => {
        setResearchData(prev => {
          response.results = [...prev.results, ...response.results]
          return response
        });
      });
    }
    if(pulseData.hasNext) {
      pulseData?.getNext()?.then(response => {
        setPulseData(prev => {
          response.results = [...prev.results, ...response.results]
          return response
        });
      });
    }
    if(countryData.hasNext) {
      countryData?.getNext()?.then(response => {
        setCountryData(prev => {
          response.results = [...prev.results, ...response.results]
          return response
        });
      });
    }
    if(knowledgeData.hasNext) {
      knowledgeData?.getNext()?.then(response => {
        setKnowledgeData(prev => {
          response.results = [...prev.results, ...response.results]
          return response
        });
      });
    }
    setLoading(false);
  }

  const _data = [ 
    ...researchData.results.map(row => {row.from = 'research'; return row}),
    ...pulseData.results.map(row => {row.from = 'pulse'; return row}),
    ...countryData.results.map(row => {row.from = 'country'; return row}),
    ...knowledgeData.results.map(row => {row.from = 'knowledge'; return row}),
  ].sort((a, b) => new Date(b.Created) - new Date(a.Created));

  const renderData = _data?.map((item, i) => {
    if(item.from === 'pulse') {
      let _CardImg = '';
      let _CardDocument = '';
        item?.AttachmentFiles?.forEach(file => {
          if(["jpeg", "jpg", "png", "gif", "tiff", "raw", "webp", "avif", "bpg", "flif"].includes(file.FileName?.split('.')[file.FileName?.split('.').length-1]?.toLowerCase())) {
            _CardImg = file?.ServerRelativePath?.DecodedUrl;
          } else if(["pdf", "doc", "docx", "html", "htm","xls", "xlsx", "txt", "ppt", "pptx", "ods"].includes(file.FileName?.split('.')[file.FileName?.split('.').length-1]?.toLowerCase())) {
            _CardDocument = file?.ServerRelativePath?.DecodedUrl;
          }
          if(_CardDocument === '' && item?.AttachmentLink != null) _CardDocument = item?.AttachmentLink
        });
      return (
        <Col key={i} xs={24} sm={12} md={8} lg={6} xxl={4}>
          <Card 
            key={i} 
            imgSrc={_CardImg} 
            title={item.Title} 
            openFile={() => _CardImg.length > 0 ? window.open(_CardDocument) : null} 
            contentStyle={{background: 'linear-gradient(0deg,rgba(0,0,0,.80),transparent 80%)'}}
          />
        </Col>
      )
    } else if(item.from === 'country') {
      let _CardImg = '';
      let _CardDocument = '';
        item.AttachmentFiles?.forEach(file => {
          if(["jpeg", "jpg", "png", "gif", "tiff", "raw", "webp", "avif", "bpg", "flif"].includes(file.FileName?.split('.')[file.FileName?.split('.').length-1]?.toLowerCase())) {
            _CardImg = file?.ServerRelativePath?.DecodedUrl;
          } else if(["pdf", "doc", "docx", "html", "htm","xls", "xlsx", "txt", "ppt", "pptx", "ods"].includes(file.FileName?.split('.')[file.FileName?.split('.').length-1]?.toLowerCase())) {
            _CardDocument = file?.ServerRelativePath?.DecodedUrl;
          }
          if(_CardDocument === '' && item.AttachmentLink != null) _CardDocument = item.AttachmentLink
        });
      return (
        <Col key={i} xs={24} sm={12} md={8} lg={6} xxl={4}>
          <Card 
            key={i} 
            imgSrc={_CardImg} 
            title={item.Title} 
            openFile={() => _CardImg.length > 0 ? window.open(_CardDocument) : null} 
          />
        </Col>
      )
    } else if(item.from === 'knowledge') {
      let _CardImg = '';
      let _CardDocument = '';
        item.AttachmentFiles?.forEach(file => {
          if(["jpeg", "jpg", "png", "gif", "tiff", "raw", "webp", "avif", "bpg", "flif"].includes(file.FileName?.split('.')[file.FileName?.split('.').length-1]?.toLowerCase())) {
            _CardImg = file?.ServerRelativePath?.DecodedUrl;
          } else if(["pdf", "doc", "docx", "html", "htm","xls", "xlsx", "txt", "ppt", "pptx", "ods"].includes(file.FileName?.split('.')[file.FileName?.split('.').length-1]?.toLowerCase())) {
            _CardDocument = file?.ServerRelativePath?.DecodedUrl;
          }
          if(_CardDocument === '' && item.AttachmentLink != null) _CardDocument = item.AttachmentLink
        });
      return (
        <Col key={i} xs={24} sm={12} md={8} lg={6} xxl={4}>
          <Card 
            key={i} 
            imgSrc={_CardImg} 
            title={item.Title} 
            openFile={() => _CardImg.length > 0 ? window.open(_CardDocument) : null} 
          />
        </Col>
      )
    } else /* if(article.from === 'research')  */{
      return (
        <Col key={i} xs={24} sm={12} md={8} lg={6} xxl={4}>
          <Card 
            key={i} 
            imgSrc={item.AttachmentFiles[0]?.ServerRelativePath?.DecodedUrl} 
            title={item.Title} 
            openFile={() => navigate(defualt_route+'/research-library/'+item.Id)}
          />
        </Col>
      )
    } 
  });

  return (
    <>
      <HistoryNavigation>
        <a onClick={() => navigate(defualt_route + '/research-library')}>Research Library</a>
        <p>Latest Publication</p>
      </HistoryNavigation>

      <div className='standard-page'>

        <Typography.Title level={2} style={{lineHeight: 2.5}}>Latest Publications</Typography.Title>

        <Row gutter={[20, 20]}>
          {!loading ? renderData : <AntdLoader />}
        </Row>

        {(researchData.hasNext || pulseData.hasNext || countryData.hasNext || knowledgeData.hasNext) ? <Row justify="center" style={{margin: '25px 0'}}>
          <Button onClick={fetchNextData}><CaretDownOutlined /> Next</Button>
        </Row> : null}
      </div>
    </>
  )
}

export default AllCategories