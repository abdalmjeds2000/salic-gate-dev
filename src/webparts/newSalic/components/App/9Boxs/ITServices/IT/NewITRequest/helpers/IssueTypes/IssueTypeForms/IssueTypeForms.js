import React from "react";
import OracleFields from "./Types/OracleFields";
import DMSFields from "./Types/DMSFields";
import USBFields from "./Types/USBFields";
import SoftwareFields from "./Types/SoftwareFields";
import PhoneExtensionsFields from "./Types/PhoneExtensionsFields";
import NewAccountFields from "./Types/NewAccountFields";
import SharedEmailFields from "./Types/SharedEmailFields";
import GLAccountFields from "./Types/GLAccountFields";
import CreateGroupEmailFields from "./Types/CreateGroupEmailFields";
import AddUserstoAGroupFields from "./Types/AddUserstoAGroupFields";
import ChangeLineManagerFields from "./Types/ChangeLineManagerFields";
import ChangeJobTitleFields from "./Types/ChangeJobTitleFields";
import MASARFields from "./Types/MASARFields";
import NewEmailAccountFields from "./Types/NewEmailAccountFields";
import InstallProgramToolFields from "./Types/InstallProgramToolFields";


function IssueTypeForms({ IssueType }) {

  if (IssueType === "Oracle") {
    return <OracleFields />;
  } else if (IssueType === "DMS") {
    return <DMSFields />;
  } else if (IssueType === "Unlock USB") {
    return <USBFields />;
  } else if (IssueType === "Software Subscription & Licenses") {
    return <SoftwareFields />;
  } else if (IssueType === "Phone Extensions") {
    return <PhoneExtensionsFields />;
  } else if (IssueType === "New Account") {
    return <NewAccountFields />;
  } else if (IssueType === "Shared Email") {
    return <SharedEmailFields />;
  } else if (IssueType === "GL Account") {
    return <GLAccountFields />;
  } else if (IssueType === "Create Group email") {
    return <CreateGroupEmailFields />;
  } else if (IssueType === "Add Users to A Group") {
    return <AddUserstoAGroupFields />;
  } else if (IssueType === "Change Line Manager") {
    return <ChangeLineManagerFields />;
  } else if (IssueType === "Change Job Title") {
    return <ChangeJobTitleFields />;
  } else if (IssueType === "MASAR") {
    return <MASARFields />;
  } else if (IssueType === "New Email Account") {
    return <NewEmailAccountFields />;
  } else if (IssueType === "Install Program") {
    return <InstallProgramToolFields />;
  }
  return <></>;
}

export default IssueTypeForms;
