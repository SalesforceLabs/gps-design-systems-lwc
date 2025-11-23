declare module "@salesforce/apex/SfGpsDsCommunitiesController.getAuthConfig" {
  export default function getAuthConfig(): Promise<any>;
}
declare module "@salesforce/apex/SfGpsDsCommunitiesController.userLogin" {
  export default function userLogin(param: {username: any, password: any}): Promise<any>;
}
declare module "@salesforce/apex/SfGpsDsCommunitiesController.userForgotPassword" {
  export default function userForgotPassword(param: {username: any}): Promise<any>;
}
declare module "@salesforce/apex/SfGpsDsCommunitiesController.getFieldset" {
  export default function getFieldset(param: {fieldsetName: any}): Promise<any>;
}
declare module "@salesforce/apex/SfGpsDsCommunitiesController.registerUser" {
  export default function registerUser(param: {username: any, password: any, fields: any}): Promise<any>;
}
