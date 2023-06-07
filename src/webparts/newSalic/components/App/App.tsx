import * as React from 'react';
import './App.css';
import { AppProps } from './AppProps';
import { BrowserRouter as Router } from 'react-router-dom';
import SidebarNav from './SidebarNav/SidebarNav';
import AppRoutes from '../Routers/AppRoutes';
import Header from '../App/Header/Header'
import pnp from 'sp-pnp-js';
import { createContext } from "react";
import axios from 'axios';
import GetPerformance from './Home/First/Left/NumbersAttendance/API/GetPerformance';
import ScrollToTop from './Global/ScrollToTop/ScrollToTop';



interface AppContext {}
export const AppCtx = createContext<AppContext | {}>(null);


// axios.interceptors.response.use(undefined, function (error) {
//   if (error.response?.status == 401) {
//     window.location.href = "https://login.microsoftonline.com/bea1b417-4237-40b8-b020-57fce9abdb43/oauth2/authorize?client%5Fid=00000003%2D0000%2D0ff1%2Dce00%2D000000000000&response%5Fmode=form%5Fpost&protectedtoken=true&response%5Ftype=code%20id%5Ftoken&resource=00000003%2D0000%2D0ff1%2Dce00%2D000000000000&scope=openid&nonce=6BD443FD3A8DDFC1738926C0D21F4EB11FFDEA1A6718E580%2DB2662F4DC94D606EAAB74E51C261868A3F44BDCD6D2089E5C223B21A97EEFE73&redirect%5Furi=https%3A%2F%2Fsalic%2Esharepoint%2Ecom%2F%5Fforms%2Fdefault%2Easpx&state=ND1UcnVlJjg9MA&claims=%7B%22id%5Ftoken%22%3A%7B%22xms%5Fcc%22%3A%7B%22values%22%3A%5B%22CP1%22%5D%7D%7D%7D&wsucxt=1&cobrandid=11bd8083%2D87e0%2D41b5%2Dbb78%2D0bc43c8a8e8a&client%2Drequest%2Did=c8b362a0%2D301e%2D5000%2D31f4%2Dbb228b002ce0&sso_reload=true";
//   }
// })

const App: React.FunctionComponent<AppProps> = (props: any) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [userData, setUserData]: any = React.useState({});
  const [notificationsCount, setNotificationsCount]: any = React.useState(0);
  const [notificationsData, setNotificationsData] = React.useState([]);
  const [mailCount, setMailCount] = React.useState('');
  const [latestAttendance, setLatestAttendance] = React.useState([]);
  const [communicationList, setCommunicationList] = React.useState([]);
  const [newsList, setNewsList] = React.useState([]);
  const [globeData, setGlobeData] = React.useState([]);
  const [isGlobeReady, setIsGlobeReady] = React.useState(false);
  const [mediaCenter, setMediaCenter] = React.useState({})
  const [oracleReports, setOracleReports] = React.useState({})
  const [notesList, setNotesList] = React.useState([])
  const [eSignRequests, setESignRequests] = React.useState([])
  const [eSignRequestsYouSignedIt, setESignRequestsYouSignedIt] = React.useState([])
  const [departmentsInfo, setDepartmentsInfo] = React.useState([]);
  const [maintenanceData, setMaintenanceData] = React.useState([]);
  const [performance, setPerformance] = React.useState({});
  const [allEvents, setAllEvents] = React.useState([]);
  const [contentRequestsData, setContentRequestsData] = React.useState([]);
  const [researchRequestsData, setResearchRequestsData] = React.useState([]);
  const [adminAssignedRequests, setAdminAssignedRequests] = React.useState([]);
  const [adminMyRequests, setAdminMyRequests] = React.useState([]);
  const [oracleFormData, setOracleFormData] = React.useState([]);
  const [salicDepartments, setSalicDepartments] = React.useState([]);
  const [myItRequestsData, setMyItRequestsData] = React.useState([]);
  const [itRequestsAssignedForMeData, setItRequestsAssignedForMeData] = React.useState([]);
  const [itCancelledRequests, setitCancelledRequests] = React.useState([]);
  // IT SERVICE REQUEST PAGE DATA
  const [summaryByStatus, setSummaryByStatus] = React.useState([]);
  const [summaryByPriority, setSummaryByPriority] = React.useState([]);
  const [summaryByDepartment, setSummaryByDepartment] = React.useState([]);
  const [summaryByRequestType, setSummaryByRequestType] = React.useState([]);
  const [ITRequests, setITRequests] = React.useState([]);
  const [showSearchResult, setShowSearchResult] = React.useState(false);
  const [researchArticlesData, setResearchArticlesData] = React.useState([]);
  const [researchNewsData, setResearchNewsData] = React.useState([]);
  const [researchPulseData, setResearchPulseData] = React.useState([]);
  const [researchCountriesData, setResearchCountriesData] = React.useState([]);
  const [knowledgeData, setKnowledgeData] = React.useState([]);
  const [gateNewsData, setGateNewsData] = React.useState([]);
  const [allResearchArticlesData, setAllResearchArticlesData] = React.useState([]);
  const [allPulseData, setAllPulseData] = React.useState({});
  const [allKnowledgeData, setAllKnowledgeData] = React.useState([]);
  const [allCountryData, setAllCountryData] = React.useState([]);
  const [salicAssetsData, setSalicAssetsData] = React.useState({});
  const [deliveryLettersData, setDeliveryLettersData] = React.useState({});
  const [myIncidentReports, setMyIncidentReports] = React.useState([]);
  const [assignedIncidentReports, setAssignedIncidentReports] = React.useState([]);
  const [incidentReportsForReview, setIncidentReportsForReview] = React.useState([]);
  const [showWelcomeMessage, setShowWelcomeMessage] = React.useState(true);
  const [isAppInSearch, setIsAppInSearch] = React.useState(false);

  

  React.useEffect(() => {
    if(userData.Data?.Mail !== null) {
      if(userData.Data?.Mail !== "stsadmin@salic.onmicrosoft.com") {
        let element = document.getElementById("spCommandBar");
        if(element) {
          element.style.display = "none";
        }
      }
    }
  }, [userData])


  // fetch notifications count func
  const fetchNotificationCount = (mail: string) => {
    axios({ method: 'GET', url: `https://dev.salic.com/api/NotificationCenter/Summary?Email=${mail}` })
      .then((res) => { 
        const sumNotiTypes: any = Object.values(res?.data?.Data).reduce((partialSum: any, a: any) => partialSum + a, 0);
        setNotificationsCount(sumNotiTypes); 
      })
      .catch((error) => console.log(error))
  }
  // fetch mail count func
  const fetchMailCount = (graphId: any) => {
    axios({ method: 'GET', url: `https://dev.salic.com/api/User/GetUnReadMessags?UserId=${graphId}` })
      .then((res) => { setMailCount(res.data.Data) })
      .catch((error) => { console.log(error) })
  }
  // fetch notifications & mail counts, for update button count in app header every 30s
  React.useEffect(() => {
    const interval = setInterval(() => {
      fetchNotificationCount(userData.Data?.Mail);
      fetchMailCount(userData.Data?.GraphId)
    }, 30000)
    return () => clearInterval(interval);
  }, [userData]);


  // Requests in first open
  React.useEffect(() => {
    // Get Current Login User
    pnp.sp.web.currentUser.get()
      .then(user => {
        return user
      })
      // Get Current User Data
      .then((user) => {
        axios({
          method: 'GET',
          url: `https://dev.salic.com/api/User/GetUserByEmail?Expand=manager&Email=${user.Email}`,
          // url: `https://dev.salic.com/api/User/GetUserByEmail?Expand=manager&Email=abdulmohsen.alaiban@salic.com`,
          // url: `https://dev.salic.com/api/User/GetUserByEmail?Expand=manager&Email=Akmal.Eldahdouh@salic.com`,
        })
          .then((response) => {
            setUserData(response.data)
            console.log(response.data)
            console.log('CONTEXT =======> ', props)
            return response
          })
          // Get Latest Attendance
          .then((response) => {
            axios({
              method: 'POST', url: `https://dev.salic.com/api/attendance/Get`,
              data: {
                Email: response.data?.Data.Mail,
                Month: new Date().getMonth() + 1,
                Year: new Date().getUTCFullYear(),
                status: -1
              }
            })
              .then((res) => setLatestAttendance(res.data?.Data))
              .catch((error) => { console.log(error) })
            return response
          })
          // Get Performance KPI's
          .then(response => {
            GetPerformance(response.data?.Data?.PIN).then((res: any) => setPerformance(res?.data)).catch((err: any) => console.log(err))
            return response
          })
          // Disable Loader
          .then((response) => {setIsLoading(false); return response})
          // (NEW) Get Notifications Count
          .then((response) => {
            fetchNotificationCount(response.data.Data?.Mail);
            return response
          })
          // Get Mail Count
          .then((response) => {
            fetchMailCount(response.data.Data?.GraphId);
            return response
          })
          // Get Departments Information for Daily Attendance
          .then((response) => {
            axios({
              method: 'GET',
              url: `https://dev.salic.com/api/leave/GetEmployeeByPINALL?UserId=${response.data?.Data?.GraphId}&PIN=${response.data?.Data?.PIN}`,
              // url: `https://dev.salic.com/api/leave/GetEmployeeByPINALL?UserId=76498786-c760-4868-bf00-9f130784f2d4&PIN=999999999`,
            })
            .then((res) => setDepartmentsInfo(res.data.Data || []))
            .catch((error) => { console.log(error) })
            return response
          })
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
    // Get Globe Data 
      axios({
        method: 'GET',
        url: 'https://vasturiano.github.io/react-globe.gl/example/datasets/ne_110m_admin_0_countries.geojson'
      })
      .then(res => setGlobeData(res.data?.features))
      .catch((error) => { console.log(error) })

    // Get All Notes
    pnp.sp.web.lists.getByTitle('Sticky Notes').items.orderBy("CreateAt", false).top(10).get()
    .then((res: any) => setNotesList(res)).catch((err: any) => { console.log(err) });
    // Get Gate Departments
    axios({method: "GET", url: "https://dev.salic.com/api/user/departments"})
    .then(response => setSalicDepartments(response.data.Data))
    .catch(null)
    
  }, []);


  // auto logout after 15min on no action on gate
  React.useEffect(() => {
    let idleTime = 0;
    const idleInterval = setInterval(timerIncrement, 30000); // 1/2 minute
    function timerIncrement() {
      idleTime = idleTime + 1;
      // console.log("idleTime", idleTime);
      if (idleTime > 30) { // 15 min
        document.location = "https://devsalic.sharepoint.com/sites/portal/_layouts/closeConnection.aspx?loginasanotheruser=true&Source=https://devsalic.sharepoint.com/sites/portal/SitePages/Home.aspx/home";
      }
    }
    const onMouseMove = () => {
      idleTime = 0;
    }
    const onKeyPress = () => {
      idleTime = 0;
    }
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("keypress", onKeyPress);
    
    return () => {
      clearInterval(idleInterval);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("keypress", onKeyPress);
    }
  }, []);








  // Context Provider
  const AppContextProviderSample: AppContext = {
    user_data: userData,
    notifications_count: notificationsCount, fetchNotificationCount,
    notifications_data: notificationsData, setNotificationsData,
    mail_count: mailCount,
    latest_attendance: latestAttendance,
    communicationList: communicationList, setCommunicationList,
    news_list: newsList,
    setNewsList,
    globe_data: globeData,
    isGlobeReady,
    setIsGlobeReady,
    media_center: mediaCenter, setMediaCenter,
    notes_list: notesList,
    setNotesList,
    defualt_route: props.spWebUrl,
    eSign_requests: eSignRequests, setESignRequests,
    eSign_requests_you_signed_it: eSignRequestsYouSignedIt, setESignRequestsYouSignedIt,
    departments_info: departmentsInfo,
    maintenance_data: maintenanceData,
    setMaintenanceData,
    performance: performance,
    setPerformance,
    all_events: allEvents, setAllEvents,
    content_requests_data: contentRequestsData,
    setContentRequestsData,
    research_requests_data: researchRequestsData,
    setResearchRequestsData,
    admin_assigned_requests: adminAssignedRequests, 
    setAdminAssignedRequests,
    admin_my_requests: adminMyRequests,
    setAdminMyRequests,
    oracle_form_data: oracleFormData, setOracleFormData,
    salic_departments: salicDepartments,
    my_it_requests_data: myItRequestsData, 
    setMyItRequestsData,
    it_requests_assigned_for_me_data: itRequestsAssignedForMeData,
    setItRequestsAssignedForMeData,
    summaryByStatus: summaryByStatus, 
    setSummaryByStatus, 
    summaryByPriority: summaryByPriority, 
    setSummaryByPriority, 
    summaryByDepartment: summaryByDepartment, 
    setSummaryByDepartment,
    summaryByRequestType: summaryByRequestType, 
    setSummaryByRequestType,
    ITRequests: ITRequests, 
    setITRequests,
    sp_context: props.context,
    sp_site: props.context._pageContext._site.absoluteUrl,
    it_cancelled_requests: itCancelledRequests, 
    setitCancelledRequests,
    showSearchResult, 
    setShowSearchResult,
    oracleReports, setOracleReports,
    researchArticlesData, setResearchArticlesData,
    researchNewsData, setResearchNewsData,
    researchPulseData, setResearchPulseData,
    researchCountriesData, setResearchCountriesData,
    knowledgeData, setKnowledgeData,
    gateNewsData, setGateNewsData,
    allResearchArticlesData, setAllResearchArticlesData,
    allPulseData, setAllPulseData,
    allKnowledgeData, setAllKnowledgeData,
    allCountryData, setAllCountryData,
    salicAssetsData, setSalicAssetsData,
    deliveryLettersData, setDeliveryLettersData,
    myIncidentReports, setMyIncidentReports,
    assignedIncidentReports, setAssignedIncidentReports,
    incidentReportsForReview, setIncidentReportsForReview,
    showWelcomeMessage, setShowWelcomeMessage,
    isAppInSearch, setIsAppInSearch
  };






  let link: any = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  link.href = 'https://dev.salic.com/File/9244ecd5-d273-4ee9-bffe-2a8fcb140860.png';

  return (
    <AppCtx.Provider value={AppContextProviderSample}>
      <div style={{display: isLoading ? 'none' : '', background: 'linear-gradient(0deg,#e0e9ff,#fff)'}}>
        <Router>
          {/* <CheckAuth> Component for send request to fetch fake data from sharepoint list every 10s, on 403 | 401 reload page  */}
            <ScrollToTop> {/* Component for scroll to top every change in route */}
              <div className="app-container">
                <SidebarNav spWebUrl={props.spWebUrl} />
                <div className="content-container">
                  <img src={require('../../assets/images/world.svg')} alt="" className='img-bg' />
                  <Header />
                  <AppRoutes {...props} />
                </div>
              </div>
            </ScrollToTop>
          {/* </CheckAuth> */}
        </Router>
      </div>
      <div className="loader" style={{height: !isLoading ? 0 : null}}>
        <img src={require('../../assets/images/logo.jpg')} alt="salic logo" style={{ maxWidth: '250px', textAlign: 'center' }} />
        <div></div>
      </div>
    </AppCtx.Provider>
  )
}
export default App;