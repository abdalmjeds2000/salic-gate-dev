import React, { useEffect, useState } from 'react'
import './CategoryPage.css';
import { Button, Col, DatePicker, Divider, Form, message, Row, Select, Tooltip, Typography } from 'antd';
import { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppCtx } from '../../../../App';
import ArticleBox from '../../../../Global/ArticleBox/ArticleBox';
import HistoryNavigation from '../../../../Global/HistoryNavigation/HistoryNavigation';
import moment from 'moment';
import pnp from 'sp-pnp-js';
import FilterPanel from '../../components/FilterPanel/FilterPanel';
import CheckableTag from 'antd/lib/tag/CheckableTag';
import AntdLoader from '../../../../Global/AntdLoader/AntdLoader';
import { CaretDownOutlined, CloseOutlined, FilterOutlined } from '@ant-design/icons';

function CategoryPage() {
  const { byType } = useParams();
  const { defualt_route, sp_context, allResearchArticlesData, setAllResearchArticlesData } = useContext(AppCtx);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const _pageSize = 24;
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isFilterData, setIsFilterData] = useState(false);
  const [openFilterPanel, setOpenFilterPanel] = useState(false);
  const [form] = Form.useForm();


  const FetchChoices = async () => {
      await pnp.sp.web.lists
      .getByTitle("Research Articles")
      .fields.getByInternalNameOrTitle('Tags')
      .select('Choices')
      .get()
      .then((data) => {
        setTags(data.Choices?.length > 0 ? data.Choices : [])
      })
  }

  const FetchData = async () => {
    await pnp.sp.web.lists.getByTitle('Research Articles')
      .items.orderBy('Created', false)
      .select('AttachmentFiles,*').expand('AttachmentFiles')
      .top(_pageSize).getPaged()
      .then(response => {
        setAllResearchArticlesData(response);
        console.log(response);
      })

    setLoading(false);
  }
  const FetchNextData = async () => {
    setLoading(true);
    allResearchArticlesData.getNext().then(response => {
      setAllResearchArticlesData(prev => {
        response.results = [...prev.results, ...response.results]
        return response
      });
    });
    setLoading(false);
  }
  
  useEffect(() => {
    if(byType) {
      ApplyFilter({Type: byType})
    } else {
      FetchData();
    }
    FetchChoices();
    document.title = ".:: SALIC Gate | Research Reports ::."; 
  }, []);

  const handleChange = (tag, checked) => {
    const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter((t) => t !== tag);
    setSelectedTags(nextSelectedTags);
  };

  const ApplyFilter = async (values) => {
    setLoading(true);
    values.Tags = selectedTags;
    if(values.PublishYear) values.PublishYear = new Date(values.PublishYear).toLocaleDateString();
    if(values.Title || values.Type || values.PublishYear || values.Tags.length > 0) {
      const startDate = new Date(new Date(values.PublishYear).getYear()+1900, 0, 1);
      const endDate = new Date(new Date(values.PublishYear).getYear()+1901, 0, 1);
      if(!values.Title) values.Title = '';
      let filterList = [];
      if(values.Title.length > 0) filterList.push(`<Contains><FieldRef Name='Title' /><Value Type='Text'>${values.Title}</Value></Contains>`);
      if(values.Type) filterList.push(`<Eq><FieldRef Name='ResearchType' /><Value Type='Choice'>${values.Type}</Value></Eq>`);
      if(values.PublishYear) filterList.push(`<Gt><FieldRef Name='PublishedDate' /><Value IncludeTimeValue='TRUE' Type='DateTime'>${startDate.toISOString()}</Value></Gt>`);
      if(values.PublishYear) filterList.push(`<Lt><FieldRef Name='PublishedDate' /><Value IncludeTimeValue='TRUE' Type='DateTime'>${endDate.toISOString()}</Value></Lt>`);
      if(values.Tags.length > 0) values.Tags.map(tag => filterList.push(`<Contains><FieldRef Name='Tags' /><Value Type='MultiChoice'>${tag}</Value></Contains>`))
      Object.keys(values).forEach(key => (values[key] === undefined || values[key] === null || values[key] === '') && delete values[key])
      const q = {
          ViewXml: `<View Scope='RecursiveAll'>
          <Query>
            <Where>
              ${filterList.map((_, i) => i != 0 ? '<And>' : '')}
              ${filterList.map((filter, i) => i != 0 ? filter+'</And>' : filter)}
            </Where>
            <OrderBy>
              <FieldRef Name='Created' Ascending='False' />
            </OrderBy>
          </Query>
          <RowLimit>50</RowLimit>
        </View>`
      }
      const items = await pnp.sp.web.lists.getByTitle("Research Articles")
      .getItemsByCAMLQuery(q, 'AttachmentFiles')
      .then(responseData => {
        if(responseData.length > 0) {
          setAllResearchArticlesData({results: responseData});
          // message.success(`Found: ${responseData.length} item`)
          setIsFilterData(true);
        } else {
          message.destroy();
          message.info("No Data Match!");
        }
      })
    }
    setLoading(false);
  }


  return (
    <>
      <HistoryNavigation>
        <a onClick={() => navigate(defualt_route + '/research-library')}>Research Library</a>
        <p>
          {byType ? `${byType} Research` : "Latest Publication" }
        </p>
      </HistoryNavigation>
      
      <Form form={form} onFinish={ApplyFilter}>
        <div className='standard-page'>
          <div style={{display: 'flex'}}>
            <FilterPanel 
              onResetFilter={() => {FetchData(1, _pageSize); setIsFilterData(false); form.resetFields(); setSelectedTags([]);}} 
              IsShowRemoveFilter={isFilterData}
              isLoading={loading}
              openFilterPanel={openFilterPanel}
            >
              <Col span={24}>
                <Divider orientation="left" orientationMargin="0">By Type</Divider>
                <Form.Item name="Type" initialValue={byType ? byType : ''}>
                  <Select
                    size="middle"
                    allowClear
                    disabled={byType}
                    placeholder="Search by Type"
                    style={{width: '100%'}}
                    options={[{value: 'Commodity', label: 'Commodity Research'},{value: 'AdHoc', label: 'Ad Hoc Research'}]}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Divider orientation="left" orientationMargin="0">Select Publish Year</Divider>
                <Form.Item name="PublishYear">
                  <DatePicker size='middle' placeholder='Pick Publish Year' style={{width: '100%'}} picker="year" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Divider orientation="left" orientationMargin="0">By Tags</Divider>
                {tags?.map((tag) => (
                  <CheckableTag
                    key={tag}
                    checked={selectedTags.indexOf(tag) > -1}
                    onChange={(checked) => handleChange(tag, checked)}
                  >
                    {tag}
                  </CheckableTag>
                ))}
              </Col>
            </FilterPanel>
            <div style={{width: '100%'}}>
              <Row justify="space-between" align="middle" wrap={true}>
                {/* <Col span={24} style={{maxWidth: '80%', margin: '0 auto'}}>
                  <Form.Item name="Title" style={{margin: '0'}}>
                    <Input 
                      placeholder="Search by Title ( Min 3 Character)" 
                      size='large' 
                      addonBefore={<SearchOutlined />} 
                      onChange={e => {
                        e.target.value?.length >= 3
                        ? (async () => {await ApplyFilter({Title: e.target.value})})() 
                        : e.target.value?.length === 0
                        ? FetchData(1, _pageSize)
                        : null
                      }}
                    />
                  </Form.Item>
                </Col> */}
                <Col span={24}>
                  <Row justify="space-between" align="middle">
                    <Typography.Title level={2} style={{lineHeight: 2.5}}>{ byType ? `${byType} Research` : "Latest Publications"}</Typography.Title>
                    <Tooltip title={!openFilterPanel ? "Open Filter Panel" : "Close Filter Panel"}>
                      <Button 
                        type="primary" 
                        shape="circle" 
                        icon={!openFilterPanel ? <FilterOutlined /> : <CloseOutlined />} 
                        onClick={() => setOpenFilterPanel(prev => !prev)} 
                      />
                    </Tooltip>
                  </Row>
                </Col>
              </Row>
              {
                !loading
                ? (
                    <Row gutter={[20, 20]}>
                      {
                        allResearchArticlesData.results?.map((article, i) => {
                          let _CardImg = '';
                          article.AttachmentFiles?.forEach(file => {
                            if(["jpeg", "jpg", "png", "gif", "tiff", "raw", "webp", "avif", "bpg", "flif"].includes(file.FileName?.split('.')[file.FileName?.split('.').length-1]?.toLowerCase())) {
                              _CardImg = file?.ServerRelativePath?.DecodedUrl;
                            }
                            });
                          return (
                            <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={6}>
                              <ArticleBox 
                                key={i}
                                Title={article.Title}
                                Description ={article.Body}
                                Poster={_CardImg}
                                To={`/research-library/${article.Id}`}
                                date={article.PublishedDate ? moment(article.PublishedDate).format('MM/DD/YYYY') : null}
                                customImgStyle={{backgroundSize: 'cover'}}
                                Tags={article.Tags ? article.Tags : []}
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
                {allResearchArticlesData.hasNext ? <Button onClick={FetchNextData}><CaretDownOutlined /> Next</Button> : null}
              </Row>
            </div>
          </div>
        </div>
      </Form>
    </>
  )
}

export default CategoryPage