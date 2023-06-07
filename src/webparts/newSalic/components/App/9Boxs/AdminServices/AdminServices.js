import React from "react";
import HistoryNavigation from "../../Global/HistoryNavigation/HistoryNavigation";
import { services, srvsIcons } from './boxsData';
import ServicesSection from "../../Global/ServicesSection/ServicesSection";
import './AdminServices.css';
import useIsAdmin from "../../Hooks/useIsAdmin";

const AdminServices = () => {
  const [isAdminUser] = useIsAdmin("Admin Users");

  const RequestCenterNoAdmin = [
    {
      icon: srvsIcons.myRequests,
      to: "/admin-services/my-requests",
      bgColor: "#FF9e9B",
      text: "My Requests",
      isLink: false,
    },
    {
      icon: srvsIcons.assignedRequests,
      to: "/admin-services/assigned-requests",
      bgColor: "#bbe",
      text: "Assigned Requests",
      isLink: false,
    }
  ];
  const RequestCenterAdmin = [
    {
      // icon: srvsIcons.dashboard,
      icon: srvsIcons.assignedRequests,
      to: "/admin-services/dashboard",
      bgColor: "#70cfaf",
      text: "Admin Services Dashboard",
      isLink: false,
    }
  ];
  return (
    <>
      <HistoryNavigation>
        <p>Admin Services Center</p>
      </HistoryNavigation>

      <div className="standard-page">
        <ServicesSection
          title="Admin Service Request"
          headerIcon={<div style={{ backgroundColor: "#79D5A7" }}>{srvsIcons.adminServices}</div>}
          items={services}
        />

        <ServicesSection
          title="Request Center"
          items={
            isAdminUser
            ? [...RequestCenterNoAdmin, ...RequestCenterAdmin]
            : [...RequestCenterNoAdmin]
          }
        />
      </div>
    </>
  );
};

export default AdminServices;



