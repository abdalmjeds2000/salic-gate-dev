import researchCenterSearch from './searchQueries/researchCenterSearch';
import newsSearch from './searchQueries/newsSearch';
import news from './searchQueries/news';
import itRequestsSearch from './searchQueries/itRequestsSearch';
import itRequests from './searchQueries/itRequests';
import researchArticlesSearch from './searchQueries/researchArticlesSearch';
import researchArticles from './searchQueries/researchArticles';
import researchCommoditySearch from './searchQueries/researchCommoditySearch';
import researchCommodity from './searchQueries/researchCommodity';
import researchAdHocSearch from './searchQueries/researchAdHocSearch';
import researchAdHoc from './searchQueries/researchAdHoc';
import researchPulseSearch from './searchQueries/researchPulseSearch';
import researchPulse from './searchQueries/researchPulse';
import researchCountrySearch from './searchQueries/researchCountrySearch';
import researchCountry from './searchQueries/researchCountry';
import researchKnowledgeSearch from './searchQueries/researchKnowledgeSearch';
import researchKnowledge from './searchQueries/researchKnowledge';
import researchRequestsSearch from './searchQueries/researchRequestsSearch';
import researchRequests from './searchQueries/researchRequests';
import salicAsstesSearch from './searchQueries/salicAsstesSearch';
import salicAsstes from './searchQueries/salicAsstes';
import deliveryLettersSearch from './searchQueries/deliveryLettersSearch';
import deliveryLetters from './searchQueries/deliveryLetters';
import manageNewsSearch from './searchQueries/manageNewsSearch';
import manageNews from './searchQueries/manageNews';
import contentRequestsSearch from './searchQueries/contentRequestsSearch';
import contentRequests from './searchQueries/contentRequests';

var fakePromise = new Promise(function(resolve) {setTimeout(resolve, 0)});

export var searchLocations = [
  /* START Research Routes */
  {
    route: "/research-library",
    path: [],
    fetchData: (query) => researchCenterSearch(query),
    fetchOriginalData: null
  }/* ,{
    route: "/research-library/categories/all",
    path: [],
    fetchData: (query) => researchArticlesSearch(query),
    fetchOriginalData: () => researchArticles()
  } */,{
    route: "/research-library/categories/Commodity",
    path: [],
    fetchData: (query) => researchCommoditySearch(query),
    fetchOriginalData: () =>  researchCommodity()
  },{
    route: "/research-library/categories/AdHoc",
    path: [],
    fetchData: (query) => researchAdHocSearch(query),
    fetchOriginalData: () => researchAdHoc()
  },{
    route: "/research-library/pulse",
    path: [],
    fetchData: (query) => researchPulseSearch(query),
    fetchOriginalData: () => researchPulse()
  },{
    route: "/research-library/country",
    path: [],
    fetchData: (query) => researchCountrySearch(query),
    fetchOriginalData: () => researchCountry()
  },{
    route: "/research-library/knowledge",
    path: [],
    fetchData: (query) => researchKnowledgeSearch(query),
    fetchOriginalData: () => researchKnowledge()
  },{
    route: "/manage-research-library",
    path: [
      'path:"https://devsalic.sharepoint.com/sites/Portal/Lists/Research Articles"',
      'path:"https://devsalic.sharepoint.com/sites/Portal/Lists/Research News"',
      'path:"https://devsalic.sharepoint.com/sites/Portal/Lists/Research Pulse"',
      'path:"https://devsalic.sharepoint.com/sites/Portal/Lists/Research Country Outlook"',
      'path:"https://devsalic.sharepoint.com/sites/Portal/Lists/Commodity Prices"',
      'path:"https://devsalic.sharepoint.com/sites/Portal/Lists/Knowledge"',
    ],
    fetchData: null,
  },{
    route: "/manage-research-library/research-articles",
    path: [
      'path:"https://devsalic.sharepoint.com/sites/Portal/Lists/Research Articles"',
    ],
    fetchData: null,
  },{
    route: "/manage-research-library/research-news",
    path: [
      'path:"https://devsalic.sharepoint.com/sites/Portal/Lists/Research News"',
    ],
    fetchData: null,
  },{
    route: "/manage-research-library/research-pulse",
    path: [
      'path:"https://devsalic.sharepoint.com/sites/Portal/Lists/Research Pulse"',
    ],
    fetchData: null,
  },{
    route: "/manage-research-library/research-country",
    path: [
      'path:"https://devsalic.sharepoint.com/sites/Portal/Lists/Research Country Outlook"',
    ],
    fetchData: null,
  },{
    route: "/manage-research-library/commodity-prices",
    path: [
      'path:"https://devsalic.sharepoint.com/sites/Portal/Lists/Commodity Prices"',
    ],
    fetchData: null,
  },{
    route: "/manage-research-library/knowledge-center",
    path: [
      'path:"https://devsalic.sharepoint.com/sites/Portal/Lists/Knowledge"',
    ],
    fetchData: null,
  },
  /* END Research Routes */
  


  /* START DMS Routes */
  {
    route: "/dms",
    path: [
      'path:"https://devsalic.sharepoint.com/sites/newsalic/KSA"',
    ],
    fetchData: null,
  },
  /* END DMS Routes */
  
  {
    route: "/community-news",
    path: [],
    fetchData: (query) => newsSearch(query),
    fetchOriginalData: () => news()
  },{
    route: "/manage-news-content",
    path: [],
    fetchData: (query) => manageNewsSearch(query),
    fetchOriginalData: () => manageNews()
  },{
    route: "/services-requests/service-requests-dashboard#2",
    path: [],
    fetchData: (query) => itRequestsSearch(query),
    fetchOriginalData: () => itRequests()
  },

  {
    route: "/research-requests/my-research-requests",
    path: [],
    fetchData: (query) => researchRequestsSearch(query),
    fetchOriginalData: () => researchRequests()
  }, {
    route: "/research-requests/all-research-requests",
    path: [],
    fetchData: (query) => researchRequestsSearch(query),
    fetchOriginalData: () => researchRequests()
  },{
    route: "/content-requests/my-content-requests",
    path: [],
    fetchData: (query) => contentRequestsSearch(query),
    fetchOriginalData: () => contentRequests()
  }, {
    route: "/content-requests/all-content-requests",
    path: [],
    fetchData: (query) => contentRequestsSearch(query),
    fetchOriginalData: () => contentRequests()
  },

  {
    route: "/asset/all#2",
    path: [],
    fetchData: (query) => salicAsstesSearch(query),
    fetchOriginalData: () => salicAsstes()
  },{
    route: "/asset/all#3",
    path: [],
    fetchData: (query) => deliveryLettersSearch(query),
    fetchOriginalData: () => deliveryLetters()
  },{
    route: "/services-requests/my-requests",
    path: [],
    fetchData: () => fakePromise,
    fetchOriginalData: () => fakePromise
  },{
    route: "/services-requests/requests-assigned-for-me",
    path: [],
    fetchData: () => fakePromise,
    fetchOriginalData: () => fakePromise
  },{
    route: "/hc-services",
    path: [],
    fetchData: () => fakePromise,
    fetchOriginalData: () => fakePromise
  },{
    route: "/admin-services",
    path: [],
    fetchData: () => fakePromise,
    fetchOriginalData: () => fakePromise
  },{
    route: "/services-requests",
    path: [],
    fetchData: () => fakePromise,
    fetchOriginalData: () => fakePromise
  },{
    route: "/e-invoicing",
    path: [],
    fetchData: () => fakePromise,
    fetchOriginalData: () => fakePromise
  },{
    route: "/content-requests",
    path: [],
    fetchData: () => fakePromise,
    fetchOriginalData: () => fakePromise
  },{
    route: "/research-requests",
    path: [],
    fetchData: () => fakePromise,
    fetchOriginalData: () => fakePromise
  },{
    route: "/book-meeting-room",
    path: [],
    fetchData: () => fakePromise,
    fetchOriginalData: () => fakePromise
  },{
    route: "/oracle-reports",
    path: [],
    fetchData: () => fakePromise,
    fetchOriginalData: () => fakePromise
  },{
    route: "/power-bi-dashboards",
    path: [],
    fetchData: () => fakePromise,
    fetchOriginalData: () => fakePromise
  },{
    route: "/power-bi-dashboards/human-capital",
    path: [],
    fetchData: () => fakePromise,
    fetchOriginalData: () => fakePromise
  },{
    route: "/power-bi-dashboards/research",
    path: [],
    fetchData: () => fakePromise,
    fetchOriginalData: () => fakePromise
  },{
    route: "/incidents-center",
    path: [],
    fetchData: () => fakePromise,
    fetchOriginalData: () => fakePromise
  },


  {
    route: "/eSignature-document",
    path: [],
    fetchData: () => fakePromise,
    fetchOriginalData: () => fakePromise
  },{
    route: "/eSignature-document#1",
    path: [],
    fetchData: () => fakePromise,
    fetchOriginalData: () => fakePromise
  },{
    route: "/eSignature-document#2",
    path: [],
    fetchData: () => fakePromise,
    fetchOriginalData: () => fakePromise
  },



  {
    route: "/incidents-center/my-reports",
    path: [],
    fetchData: () => fakePromise,
    fetchOriginalData: () => fakePromise
  },{
    route: "/incidents-center/assigned-reports",
    path: [],
    fetchData: () => fakePromise,
    fetchOriginalData: () => fakePromise
  },{
    route: "/incidents-center/request-for-review",
    path: [],
    fetchData: () => fakePromise,
    fetchOriginalData: () => fakePromise
  },
];