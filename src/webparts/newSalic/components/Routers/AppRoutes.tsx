import * as React from 'react';
import { RoutersProps } from './RoutersProps';
import { Routes, Route, Navigate } from 'react-router-dom';
import {
  Home,
  Communication,
  AdminServices,
  HRSelf,
  ITServices,
  NewITRequest,
  RegisterNewAssets,
  AllAssets,
  ManageAsset,
  MyItServiceRequests,
  ITRequestsAssignedForMe,
  PreviewITServiceRequest,
  CancelledRequests,
  ServiceRequestsDashboard,
  NotificationCenter,
  IssuingVISA,
  BusinessGate,
  Maintenance,
  ShipmentRequest,
  OfficeSupply,
  Transportation,
  AssignedRequests,
  MyRequests,
  Visitor,
  Attendance,
  CommunityNews,
  NewsDetails,
  FolderExplorerPage,
  EInvoicing,
  Performance,
  AlMiraMagazine,
  MeetingCenter,
  NewMeeting,
  MyMeetings,
  RoomsCalender,
  OracleReports,
  ESignatureTool,
  Investment,
  Finance,
  CorporateServices,
  Legal,
  RiskStrategy,
  CorporateCommunication,
  PowerBIInteractiveDashboards,
  HumanCapital,
  HRDashboard,
  EmployeeAnalyticsDashboard,
  Research,
  CountryOutlook,
  DelegationVisit,
  CrisisPlan,
  DemandForecast,
  DomesticPrices,
  InternationalPrices,
  DailyDashboard,
  ContentRequests,
  NewContentRequest,
  AllContentRequests,
  MyContentRequests,
  PreviewContentRequest,
  ResearchRequests,
  NewResearchRequest,
  MyResearchRequests,
  AllResearchRequests,
  PreviewResearchRequest,
  ArticlePage,
  ManageDashboardData,
  ResearchArticles,
  ResearchNews,
  ResearchCountry,
  ResearchPulse,
  CommodityPrices,
  KnowledgeCenter,
  ManageNewsContent,
  ManageEvents,
  SPSearch,
  CorporateObjectiveKPIs,
  InputScreen,
  ManageFocalPoints,
  ResearchDashboard,
  CategoryPage,
  PulseSection,
  CountryCardsPage,
  KnowledgeCardsPage,
  IncidentsCenter,
  NewIncidentReport,
  MyReports,
  AssignedReports,
  RequestsForReview,
  PreviewIncidentReport,
  ManageNews,
  MyTeam,
  SalicProfile,
  AlmiraVersions,
  PageNotFound,
  AnnualReports,
  SALICPresentation,
  ManageOracleReports,
  AdminDashboard,
  Feedback,
  BoD,
  FinanceMaster,
  KeyFinanceMetrics,
  BoDMeetings,
  ResolutionByCirculation,
  Contribution,
  InvestmentPipeline,
  Strategy,
  InvestmentLiveTransactions,
  AllCategories,
} from './ImportFiles';



const AppRoutes: React.FunctionComponent<RoutersProps> = (props) => {
  const defualtRoute: string = props.spWebUrl;


  return (
    <Routes>
      <Route path={`${defualtRoute}/home`} element={<Home />} />
      <Route path={`${defualtRoute}`} element={<Navigate replace to={`${defualtRoute}/home`}/>} />
      <Route path={`${defualtRoute}/communication`} element={<Communication />} />
      <Route path={`${defualtRoute}/dms`} element={<FolderExplorerPage /* {...props} *//>} />
      

      <Route path={`${defualtRoute}/salic-profile`}>
        <Route index element={<SalicProfile />} />
        <Route path={`${defualtRoute}/salic-profile/annual-reports`} element={<AnnualReports />} />
        <Route path={`${defualtRoute}/salic-profile/salic-presentation`} element={<SALICPresentation />} />
      
        <Route path={`${defualtRoute}/salic-profile/almira-versions`}>
          <Route index element={<AlmiraVersions />} />
          <Route path={`${defualtRoute}/salic-profile/almira-versions/almira-magazine`} element={<AlMiraMagazine />} />
        </Route>
      </Route>

      <Route path={`${defualtRoute}/oracle-reports`} element={<OracleReports />} />
      <Route path={`${defualtRoute}/manage-oracle-reports`} element={<ManageOracleReports />} />

      <Route path={`${defualtRoute}/attendance`} element={<Attendance />} />

      <Route path={`${defualtRoute}/community-news`}>
        <Route index element={<CommunityNews />} />
        <Route path={`${defualtRoute}/community-news/:id`} element={<NewsDetails />} />
      </Route>

      <Route path={`${defualtRoute}/admin-services`}>
        <Route index element={<AdminServices />} />
        <Route path={`${defualtRoute}/admin-services/issuing-VISA`}>
          <Route index element={<IssuingVISA />} />
          <Route path={`${defualtRoute}/admin-services/issuing-VISA/:id`} element={<IssuingVISA />} />
        </Route>
        <Route path={`${defualtRoute}/admin-services/shipment`}>
          <Route index element={<ShipmentRequest />} />
          <Route path={`${defualtRoute}/admin-services/shipment/:id`} element={<ShipmentRequest />} />
        </Route>
        <Route path={`${defualtRoute}/admin-services/maintenance`}>
          <Route index element={<Maintenance />} />
          <Route path={`${defualtRoute}/admin-services/maintenance/:id`} element={<Maintenance />} />
        </Route>
        <Route path={`${defualtRoute}/admin-services/visitor`}>
          <Route index element={<Visitor />} />
          <Route path={`${defualtRoute}/admin-services/visitor/:id`} element={<Visitor />} />
        </Route>
        <Route path={`${defualtRoute}/admin-services/transportation`}>
          <Route index element={<Transportation />} />
          <Route path={`${defualtRoute}/admin-services/transportation/:id`} element={<Transportation />} />
        </Route>
        <Route path={`${defualtRoute}/admin-services/business-gate`}>
          <Route index element={<BusinessGate />} />
          <Route path={`${defualtRoute}/admin-services/business-gate/:id`} element={<BusinessGate />} />
        </Route>
        <Route path={`${defualtRoute}/admin-services/office-supply`}>
          <Route index element={<OfficeSupply />} />
          <Route path={`${defualtRoute}/admin-services/office-supply/:id`} element={<OfficeSupply />} />
        </Route>
        <Route path={`${defualtRoute}/admin-services/assigned-requests`} element={<AssignedRequests />} />
        <Route path={`${defualtRoute}/admin-services/my-requests`} element={<MyRequests />} />
        <Route path={`${defualtRoute}/admin-services/dashboard`} element={<AdminDashboard />} />
      </Route>
      
      <Route path={`${defualtRoute}/services-requests`}>
        <Route index element={<ITServices />} />
        <Route path={`${defualtRoute}/services-requests/services-request`} element={<NewITRequest />} />
        <Route path={`${defualtRoute}/services-requests/my-requests`} element={<MyItServiceRequests />} />
        <Route path={`${defualtRoute}/services-requests/requests-assigned-for-me`}>
          <Route index element={<ITRequestsAssignedForMe />} />
          <Route path={`${defualtRoute}/services-requests/requests-assigned-for-me/:query`} element={<ITRequestsAssignedForMe />} />
        </Route>
        
        <Route path={`${defualtRoute}/services-requests/service-requests-dashboard`} element={<ServiceRequestsDashboard />} />
        <Route path={`${defualtRoute}/services-requests/cancelled`} element={<CancelledRequests />} />
        <Route path={`${defualtRoute}/services-requests/:id`} element={<PreviewITServiceRequest />} />
      </Route>
      <Route path={`${defualtRoute}/asset`}>
        <Route path={`${defualtRoute}/asset/new-asset`} element={<RegisterNewAssets />} />
        <Route path={`${defualtRoute}/asset/all`} element={<AllAssets />} />
        <Route path={`${defualtRoute}/asset/manage`} element={<Navigate replace to={`${defualtRoute}/asset/all`}/>} />
        <Route path={`${defualtRoute}/asset/manage/:id`} element={<ManageAsset />} />
      </Route>
      <Route path={`${defualtRoute}/e-invoicing`}>
        <Route index element={<EInvoicing />} />
      </Route>
      <Route path={`${defualtRoute}/performance-managment`}>
        <Route index element={<Performance />} />
      </Route>
      <Route path={`${defualtRoute}/hc-services`} element={<HRSelf />} />
      <Route path={`${defualtRoute}/notification-center`} element={<NotificationCenter />} />
      <Route path={`${defualtRoute}/book-meeting-room`}>
        <Route index element={<MeetingCenter />} />
        <Route path={`${defualtRoute}/book-meeting-room/new-meeting`} element={<NewMeeting />} />
        <Route path={`${defualtRoute}/book-meeting-room/my-meetings`} element={<MyMeetings />} />
        <Route path={`${defualtRoute}/book-meeting-room/rooms-calender`} element={<RoomsCalender />} />
      </Route>
      <Route path={`${defualtRoute}/eSignature-document`} element={<ESignatureTool />} />
      
      <Route path={`${defualtRoute}/research-library`}>
        <Route index element={<ResearchDashboard />} />
        <Route path={`${defualtRoute}/research-library/country`} element={<CountryCardsPage />} />
        <Route path={`${defualtRoute}/research-library/pulse`} element={<PulseSection />} />
        <Route path={`${defualtRoute}/research-library/knowledge`} element={<KnowledgeCardsPage />} />
        {/* <Route path={`${defualtRoute}/research-library/categories/all`} element={<CategoryPage />} /> */}
        <Route path={`${defualtRoute}/research-library/categories/all`} element={<AllCategories />} />
        <Route path={`${defualtRoute}/research-library/categories/:byType`} element={<CategoryPage />} />
        <Route path={`${defualtRoute}/research-library/:id`} element={<ArticlePage />} />
      </Route>

      <Route path={`${defualtRoute}/org-doc-investment`} element={<Investment />} />
      <Route path={`${defualtRoute}/org-doc-finance`} element={<Finance />} />
      <Route path={`${defualtRoute}/org-doc-corporate-services`} element={<CorporateServices />} />
      <Route path={`${defualtRoute}/org-doc-legal`} element={<Legal />} />
      <Route path={`${defualtRoute}/org-doc-risk-strategy`} element={<RiskStrategy />} />
      <Route path={`${defualtRoute}/org-doc-corporate-communication`} element={<CorporateCommunication />} />


      <Route path={`${defualtRoute}/power-bi-dashboards`}>
        <Route index element={<PowerBIInteractiveDashboards />} />

        <Route path={`${defualtRoute}/power-bi-dashboards/human-capital`}>
          <Route index element={<HumanCapital />} />
          <Route path={`${defualtRoute}/power-bi-dashboards/human-capital/hr-dashboard`} element={<HRDashboard />} />
          <Route path={`${defualtRoute}/power-bi-dashboards/human-capital/employee-analytics-dashboard`} element={<EmployeeAnalyticsDashboard />} />
        </Route>
        <Route path={`${defualtRoute}/power-bi-dashboards/research`}>
          <Route index element={<Research />} />
          <Route path={`${defualtRoute}/power-bi-dashboards/research/country-outlook`} element={<CountryOutlook />} />
          <Route path={`${defualtRoute}/power-bi-dashboards/research/delegation-visit`} element={<DelegationVisit />} />
          <Route path={`${defualtRoute}/power-bi-dashboards/research/crisis-plan`} element={<CrisisPlan />} />
          <Route path={`${defualtRoute}/power-bi-dashboards/research/demand-forecast`} element={<DemandForecast />} />
          <Route path={`${defualtRoute}/power-bi-dashboards/research/domestic-prices`} element={<DomesticPrices />} />
          <Route path={`${defualtRoute}/power-bi-dashboards/research/international-prices`} element={<InternationalPrices />} />
          <Route path={`${defualtRoute}/power-bi-dashboards/research/daily-dashboard`} element={<DailyDashboard />} />
        </Route>
      </Route>

      <Route path={`${defualtRoute}/content-requests`}>
        <Route index element={<ContentRequests />} />
        <Route path={`${defualtRoute}/content-requests/new-request`} element={<NewContentRequest />} />
        <Route path={`${defualtRoute}/content-requests/all-content-requests`} element={<AllContentRequests />} />
        <Route path={`${defualtRoute}/content-requests/my-content-requests`} element={<MyContentRequests />} />
        <Route path={`${defualtRoute}/content-requests/:id`} element={<PreviewContentRequest />} />
      </Route>

      <Route path={`${defualtRoute}/research-requests`}>
        <Route index element={<ResearchRequests />} />
        <Route path={`${defualtRoute}/research-requests/new-request`} element={<NewResearchRequest />} />
        <Route path={`${defualtRoute}/research-requests/all-research-requests`} element={<AllResearchRequests />} />
        <Route path={`${defualtRoute}/research-requests/my-research-requests`} element={<MyResearchRequests />} />
        <Route path={`${defualtRoute}/research-requests/:id`} element={<PreviewResearchRequest />} />
      </Route>

      <Route path={`${defualtRoute}/manage-research-library`}>
        <Route index element={<ManageDashboardData />} />
        <Route path={`${defualtRoute}/manage-research-library/research-articles`} element={<ResearchArticles />} />
        <Route path={`${defualtRoute}/manage-research-library/research-news`} element={<ResearchNews />} />
        <Route path={`${defualtRoute}/manage-research-library/research-pulse`} element={<ResearchPulse />} />
        <Route path={`${defualtRoute}/manage-research-library/research-country`} element={<ResearchCountry />} />
        <Route path={`${defualtRoute}/manage-research-library/commodity-prices`} element={<CommodityPrices />} />
        <Route path={`${defualtRoute}/manage-research-library/knowledge-center`} element={<KnowledgeCenter />} />
      </Route>
      
      <Route path={`${defualtRoute}/manage-news-content`} element={<ManageNewsContent />} />

      <Route path={`${defualtRoute}/manage-media-center`} element={<ManageNews />} />
      <Route path={`${defualtRoute}/manage-events`} element={<ManageEvents />} />
      <Route path={`${defualtRoute}/sp-search`} element={<SPSearch />} />
      <Route path={`${defualtRoute}/corporate-objective`} element={<CorporateObjectiveKPIs />} />
      <Route path={`${defualtRoute}/manage-corporate-objective`} element={<InputScreen />} />
      <Route path={`${defualtRoute}/manage-focal-points`} element={<ManageFocalPoints />} />
      
      
      <Route path={`${defualtRoute}/incidents-center`}>
        <Route index element={<IncidentsCenter />} />
        <Route path={`${defualtRoute}/incidents-center/new-report`} element={<NewIncidentReport />} />
        <Route path={`${defualtRoute}/incidents-center/my-reports`} element={<MyReports />} />
        <Route path={`${defualtRoute}/incidents-center/assigned-reports`} element={<AssignedReports />} />
        <Route path={`${defualtRoute}/incidents-center/request-for-review`} element={<RequestsForReview />} />
        <Route path={`${defualtRoute}/incidents-center/report/:id`} element={<PreviewIncidentReport />} />
      </Route>

      <Route path={`${defualtRoute}/my-team`} element={<MyTeam />} />

      <Route path={`${defualtRoute}/feedback`} element={<Feedback />} />



      <Route path={`${defualtRoute}/bod`}>
        <Route index element={<BoD />} />
        <Route path={`${defualtRoute}/bod/finance-master`} element={<FinanceMaster />} />
        <Route path={`${defualtRoute}/bod/key-financial-metrics`} element={<KeyFinanceMetrics />} />

        <Route path={`${defualtRoute}/bod/investment-pipeline`}>
          <Route index element={<InvestmentPipeline />} />
        </Route>
        <Route path={`${defualtRoute}/bod/investment-live-transactions`}>
          <Route index element={<InvestmentLiveTransactions />} />
        </Route>
        <Route path={`${defualtRoute}/bod/strategy`}>
          <Route index element={<Strategy />} />
        </Route>
        
        <Route path={`${defualtRoute}/bod/meetings/audit-committee`} element={<BoDMeetings meetingType='Audit Committee Update' listName='BoD Audit Committee' groupName='BoD Investment Members' />} />
        <Route path={`${defualtRoute}/bod/meetings/investment-committee`} element={<BoDMeetings meetingType='Investment Committee Update' listName='BoD Investment Committee' groupName='BoD Committee Members' />} />
        <Route path={`${defualtRoute}/bod/meetings/risk-and-sustainability-committee`} element={<BoDMeetings meetingType='Risk and Sustainability Committee Update' listName='BoD Risk and Sustainability Committee' groupName='BoD Committee Members' />} />
        <Route path={`${defualtRoute}/bod/meetings/nominationand-remuneration-committee`} element={<BoDMeetings meetingType='Nomination and Remuneration Committee Update' listName='BoD Nomination and Remuneration Committee' groupName='BoD Committee Members' />} />
        
        <Route path={`${defualtRoute}/bod/resolution-by-circulation`} element={<ResolutionByCirculation />} />
        <Route path={`${defualtRoute}/bod/contribution`} element={<Contribution />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}
export default AppRoutes