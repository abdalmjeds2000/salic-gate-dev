import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { boxsIcons } from './icons';
import { AppCtx } from '../../App';
import pnp from 'sp-pnp-js';


const CommunityNews = () => {
  const { user_data, defualt_route } = useContext(AppCtx);
  let navigate = useNavigate();
  const communityNewsBoxs = [
    {id: 0, to: '/org-doc-investment', name: 'Investment', icon: boxsIcons.Policies},
    {id: 1, to: '/org-doc-finance', name: 'Finance', icon: boxsIcons.Circulations},
    {id: 2, to: '/org-doc-corporate-services', name: 'Corporate Services', icon: boxsIcons.Offers},
    {id: 3, to: '/org-doc-legal', name: 'Legal', icon: boxsIcons.UserGuides},
    {id: 4, to: '/org-doc-risk-strategy', name: 'Risk Strategy', icon: boxsIcons.Research},
    {id: 5, to: '/org-doc-corporate-communication', name: 'Corporate Communication', icon: boxsIcons.SALICTemplates},
    // {id: 0, name: 'Policies', icon: boxsIcons.Policies},
    // {id: 1, name: 'Circulations', icon: boxsIcons.Circulations},
    // {id: 2, name: 'Offers', icon: boxsIcons.Offers},
    // {id: 3, name: 'User Guides', icon: boxsIcons.UserGuides},
    // {id: 4, name: 'Research', icon: boxsIcons.Research},
    // {id: 5, name: 'SALIC Templates', icon: boxsIcons.SALICTemplates},
  
  ];
  const [newsList, setNewsList] = useState([]);

  const fetchData = async () => {
    const response = await pnp.sp.web.lists.getByTitle('News').items
      .select('Author/Title,Author/EMail,Author/JobTitle,Subject,Photos,Id,ID,IsDraft,Description,CreatedOn,Created,IsPerson,AttachmentFiles')
      .expand('Author,AttachmentFiles').top(5).orderBy("CreatedOn", false).get()
    setNewsList(response);
  }
  useEffect(() => {
    if(Object.keys(user_data).length > 0) {
      fetchData();
    }
  }, [user_data]);

  return (
    <div className="community-news">
      <div className="news_organization_container">
        <div className="news">
          <div className='content'>
            <div className='last-news-container'>
              <div className="header">
                <h3>Community News</h3>
                <a onClick={_ => navigate(`${defualt_route}/community-news`)}>See All</a>
              </div>
              <div className='news-list' id='home-news-list'>
                {
                  newsList.map((row, i) => {
                    const description = row.Description.replace(/<[^>]*>?/gm, '').replace(/&(nbsp|amp|quot|lt|gt);/g, "");
                    return (
                      <div className="box" key={i}>
                        <div className='img' style={{backgroundImage: `url("${row.AttachmentFiles.length > 0 ? row.AttachmentFiles[0]?.ServerRelativeUrl : row.Photos}")`, backgroundColor: 'var(--third-color)'}}></div>
                        <div className='text'>
                          <h3 className="title">
                            <a onClick={() => navigate(`${defualt_route}/community-news/${row.Id}`)}>{row.Subject}</a>
                          </h3>
                          <p className="description">{description}</p>
                        </div>
                      </div>
                    )
                  })
                }

              </div>
              {/* <DownOutlined onClick={slideBottom} className="bottom-scroll-icon arrow arrow-btm" style={{top: '50%'}} /> */}
            </div>
            <div className="organization-documents-container">
              <div className="header">
                <h3>Organization Documents</h3>
              </div>
              <div className="boxs">
                {communityNewsBoxs.map(box => {
                  return <a onClick={_ => navigate(defualt_route + box.to)} key={box.id} className="oranization-documents">
                    <div>
                      {box.icon}
                    </div>
                    <p>{box.name}</p>
                  </a>
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommunityNews