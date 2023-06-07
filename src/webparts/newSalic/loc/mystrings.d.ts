declare interface INewSalicWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;
  
  NameFieldLabel: string;  
  ServerRelativeURLFieldLabel: string;  
}

declare module 'NewSalicWebPartStrings' {
  const strings: INewSalicWebPartStrings;
  export = strings;
}
