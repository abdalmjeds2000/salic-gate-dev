import React, { useContext, useEffect } from 'react'
import HistoryNavigation from '../../Global/HistoryNavigation/HistoryNavigation';
import { AppCtx } from '../../App';
import { icons } from './boxsData';
import ServicesSection from '../../Global/ServicesSection/ServicesSection';


function HRSelf() {
  const { user_data } = useContext(AppCtx);

  let checkMobile = (desktopLink, dataApplicationName) => {
    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
      if(dataApplicationName === undefined) {
        return desktopLink
      } else {
        return `https://dev.salic.com/api/user/generate_identifier/${btoa(user_data?.Data?.PIN)}?ApplicationName=${dataApplicationName}`
      }
    } else {
      return desktopLink
    }
  }
  const services = [
    {icon: icons.BusinessTrip, bgColor: '#43A2CC', isLink: true, text: 'Business Trip', to: checkMobile('https://hen.fa.em2.oraclecloud.com/fscmUI/faces/FuseOverview?fndGlobalItemNodeId=EXT_EXTN1521037485862_MENU_1521720725439', 'BUSINESS_TRIP')},
    {icon: icons.BusinessTripCompletion, bgColor: '#EBD944', isLink: true, text: 'Business Trip Completion', to: checkMobile('https://hen.fa.em2.oraclecloud.com/fscmUI/faces/FuseOverview?fndGlobalItemNodeId=EXT_EXTN1521037485862_MENU_1521720887453', 'BUSINESS_TRIP_COMPLETION')},
    {icon: icons.TrainingRequest, bgColor: '#9BC9ED', isLink: true, text: 'Training Request', to: checkMobile('https://hen.fa.em2.oraclecloud.com/fscmUI/faces/FuseOverview?fndGlobalItemNodeId=EXT_EXTN1521037485862_MENU_1580212664537', 'TRAINING')},
    {icon: icons.LeaveRequest, bgColor: '#FBBE82', isLink: true, text: 'Leave Request', to: 'https://hen.fa.em2.oraclecloud.com/fscmUI/faces/deeplink?objType=ADD_ABSENCE&action=NONE'},
    {icon: icons.OverTimeRequest, bgColor: '#70CFAF', isLink: true, text: 'OverTime Request', to: checkMobile('https://hen.fa.em2.oraclecloud.com/fscmUI/faces/FuseOverview?fndGlobalItemNodeId=EXT_EXTN1521037485862_MENU_1521037486455', 'OVERTIME')},
    {icon: icons.SalaryInAdvance, bgColor: '#F7937B', isLink: true, text: 'Salary In Advance', to: checkMobile('https://hen.fa.em2.oraclecloud.com/fscmUI/faces/FuseOverview?fndGlobalItemNodeId=EXT_EXTN1521037485862_MENU_1521747065911', 'SALARY')},
    {icon: icons.HousingAdvance, bgColor: '#FD96A6', isLink: true, text: 'Housing Advance', to: checkMobile('https://hen.fa.em2.oraclecloud.com/fscmUI/faces/FuseOverview?fndGlobalItemNodeId=EXT_EXTN1521037485862_MENU_1521721611230', 'HOUSING_ADVANCE')},
    {icon: icons.VacationAllowance, bgColor: '#9BC9ED', isLink: true, text: 'Vacation Allowance', to: checkMobile('https://hen.fa.em2.oraclecloud.com/fscmUI/faces/FuseOverview?fndGlobalItemNodeId=EXT_EXTN1521037485862_MENU_1521747358525', 'VACATION_ALLOWANCE')},
    {icon: icons.HRLetter, bgColor: '#9BC9ED', isLink: true, text: 'HR Letter', to: checkMobile('https://hen.fa.em2.oraclecloud.com/fscmUI/faces/FuseOverview?fndGlobalItemNodeId=EXT_EXTN1521037485862_MENU_1521721761601', 'HR_LETTER')},
    {icon: icons.ViewPayslip, bgColor: '#70CFAF', isLink: true, text: 'View Payslip', to: 'https://hen.fa.em2.oraclecloud.com/analytics/saw.dll?bipublisherEntry&Action=open&itemType=.xdo&bipPath=%2FCustom%2FHuman%20Capital%20Management%2FPayroll%2FPayment%20Distribution%2FSALIC%20Payslip%20SP.xdo'},
    {icon: icons.GymReimbursement, bgColor: '#FBBE82', isLink: true, text: 'Gym Reimbursement', to: checkMobile('https://hen.fa.em2.oraclecloud.com/fscmUI/faces/FuseOverview?fndGlobalItemNodeId=EXT_EXTN1521037485862_MENU_1585574179603', 'GYM')},
    {icon: icons.DaycareAllowance, bgColor: '#F7937B', isLink: true, text: 'Daycare Allowance', to: checkMobile('https://hen.fa.em2.oraclecloud.com/fscmUI/faces/FuseOverview?fndGlobalItemNodeId=EXT_EXTN1521037485862_MENU_1599107940767', 'CHILDCARE')},
    {icon: icons.ResignationRequest, bgColor: '#EBD944', isLink: true, text: 'Resignation Request', to: checkMobile('https://hen.fa.em2.oraclecloud.com/fscmUI/faces/FuseOverview?fndGlobalItemNodeId=EXT_EXTN1521037485862_MENU_1603363085618', 'RESIG')},
    {icon: icons.ProbationPeriodEvaluation, bgColor: '#70CFAF', isLink: true, text: 'Probation Period Evaluation', to: checkMobile('https://hen.fa.em2.oraclecloud.com/fscmUI/faces/FuseOverview?fndGlobalItemNodeId=EXT_EXTN1521037485862_MENU_1632010071862', 'PROPERIOD')},
    {icon: icons.RelocationAllowance, bgColor: '#EBD944', isLink: true, text: 'Relocation Allowance', to: checkMobile('https://hen.fa.em2.oraclecloud.com/fscmUI/faces/FuseOverview?fndGlobalItemNodeId=EXT_EXTN1521037485862_MENU_1632010121236', 'RELOCATION_ALLOW')},
    {icon: icons.ProfessionalCertificate, bgColor: '#FBBE82', isLink: true, text: 'Business Card', to: checkMobile('https://hen.fa.em2.oraclecloud.com/fscmUI/faces/FuseOverview?fndGlobalItemNodeId=EXT_EXTN1521037485862_MENU_1632010010069', 'BUSINESSCARD')},
    {icon: icons.BusinessCard, bgColor: '#43A2CC', isLink: true, text: 'Professional Certificate Reimbursement', to: checkMobile('https://hen.fa.em2.oraclecloud.com/fscmUI/faces/FuseOverview?fndGlobalItemNodeId=EXT_EXTN1521037485862_MENU_1653797991863', 'PRC_URL')},
    {icon: icons.ClearanceRequest, bgColor: '#FF6666', isLink: true, text: 'Clearance Request', to: checkMobile('https://hen.fa.em2.oraclecloud.com/fscmUI/faces/FuseOverview?fndGlobalItemNodeId=EXT_EXTN1521037485862_MENU_1605716491054', 'PRC_URL')},
    {icon: icons.ChangeSalary, bgColor: '#9BC9ED', isLink: true, text: 'Change Salary Bank Account', to: 'https://hen.fa.em2.oraclecloud.com/fndSetup/faces/FuseOverview?fndGlobalItemNodeId=EXT_EXTN1521037485862_MENU_1684909116521'},
  ];


  useEffect(() => {
    document.title = '.:: SALIC Gate | Human Capital Services ::.'
  }, []);

  if(Object.keys(user_data)?.length === 0) {
    return null;
  }

  return (
    <>
      <HistoryNavigation>
        <p>Human Capital Services</p>
      </HistoryNavigation>
      <div className='standard-page'>
        <ServicesSection
          title="Employee Self Services"
          headerIcon={<div style={{backgroundColor: '#0A89C1'}}>{icons.HRSelfServices}</div>}
          items={services}
        />

        <ServicesSection
          title="Performance Management"
          headerIcon={<div style={{backgroundColor: '#0A89C1'}}>{icons.Performance}</div>}
          items={[
            {icon: icons.PMSEmployee, bgColor: '#FD96A6', text: 'Performance Management System (PMS)- Employee', isLink: true, to: 'https://hen.fa.em2.oraclecloud.com/fndSetup/faces/FuseOverview?fndGlobalItemNodeId=EXT_EXTN1521037485862_MENU_1558973037870'},
            {icon: icons.PMSEmployee, bgColor: '#70CFAF', text: 'Performance Management System (PMS)- Managers', isLink: true, to: 'https://hen.fa.em2.oraclecloud.com/fndSetup/faces/FuseOverview?fndGlobalItemNodeId=EXT_EXTN1521037485862_MENU_1558972767621'},
            {icon: icons.PMSManagers, bgColor: '#6e5eeb', isLink: false, text: 'Corporate Objective KPIs', to: '/corporate-objective'},
            // {icon: icons.PMSManagers, bgColor: '#9BC9ED', isLink: true, text: 'Corporate Objective KPIs', to: "https://devsalic.sharepoint.com/sites/MDM/SitePages/Home.aspx/corporate-objective"  /* '/corporate-objective' */},
          ]}
        />

        <ServicesSection
          title="Recruitment System"
          headerIcon={<div style={{backgroundColor: '#0A89C1'}}>{icons.Recruitment}</div>}
          items={[
            {icon: icons.Recruitment, bgColor: '#F7937B', text: 'Recruitment', isLink: true, to: 'https://hen.fa.em2.oraclecloud.com/fscmUI/faces/FuseOverview?fndGlobalItemNodeId=EXT_EXTN1521037485862_MENU_1650137021932'},
            {icon: icons.RecruitmentRequest, bgColor: '#EBD944', isLink: true, text: 'Recruitment Request', to: 'https://hen.fa.em2.oraclecloud.com/fscmUI/faces/FuseOverview?fndGlobalItemNodeId=EXT_EXTN1521037485862_MENU_1587224172941'},
          ]}
        />

      </div>
    </>
  )
}

export default HRSelf