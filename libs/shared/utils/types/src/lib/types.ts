export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: string; output: string; }
  EmailAddress: { input: string; output: string; }
  PhoneNumber: { input: string; output: string; }
  PositiveFloat: { input: number; output: number; }
  PositiveInt: { input: number; output: number; }
  URL: { input: string; output: string; }
  UUID: { input: string; output: string; }
  Upload: { input: any; output: any; }
};

export type IAccessToken = {
  accessToken?: Maybe<Scalars['String']['output']>;
};

export type IActivityLogModel = {
  action: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  description: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  type?: Maybe<IActivityLogType>;
  userId: Scalars['Int']['output'];
};

export enum IActivityLogType {
  Error = 'ERROR',
  Info = 'INFO',
  Success = 'SUCCESS',
  Warning = 'WARNING'
}

export type IActivityLogUserModel = {
  action: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  description: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  type?: Maybe<IActivityLogType>;
  userId: Scalars['Int']['output'];
};

export type IBrandModel = {
  catalogues?: Maybe<Array<Maybe<ICatalogueModel>>>;
  companyName?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  images?: Maybe<Array<Maybe<IFileUploadModel>>>;
  name: Scalars['String']['output'];
};

export type ICatalogueModel = {
  brand: IBrandModel;
  brandId: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  inventories?: Maybe<Array<Maybe<IInventoryModel>>>;
  name: Scalars['String']['output'];
  pricePerUnit?: Maybe<Scalars['Float']['output']>;
  quantityPerUnit: Scalars['Float']['output'];
  unit: ICatalogueUnit;
};

export enum ICatalogueUnit {
  Kg = 'KG',
  Litre = 'LITRE'
}

export type ICountriesLanguagesInput = {
  countryId: Scalars['Int']['input'];
  languageId: Scalars['Int']['input'];
};

export type ICreateActivityLogInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type ICreateActivityLogSuccessResponse = {
  data: IActivityLogModel;
  message: Scalars['String']['output'];
};

export type ICreateBrandCatalogueInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
  name: Scalars['String']['input'];
  pricePerUnit?: InputMaybe<Scalars['Float']['input']>;
  quantityPerUnit: Scalars['Float']['input'];
  unit: ICatalogueUnit;
};

export type ICreateBrandInput = {
  catalogues?: InputMaybe<Array<InputMaybe<ICreateBrandCatalogueInput>>>;
  companyName?: InputMaybe<Scalars['String']['input']>;
  images?: InputMaybe<Array<InputMaybe<ISelectCategory>>>;
  name: Scalars['String']['input'];
};

export type ICreateBrandSuccessResponse = {
  data: IBrandModel;
  message: Scalars['String']['output'];
};

export type ICreateCatalogueInput = {
  brandId: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  pricePerUnit?: InputMaybe<Scalars['Float']['input']>;
  quantityPerUnit: Scalars['Float']['input'];
  unit: ICatalogueUnit;
};

export type ICreateCatalogueSuccessResponse = {
  data: ICatalogueModel;
  message: Scalars['String']['output'];
};

export type ICreateInventoryInput = {
  catalogueId: Scalars['String']['input'];
  quantity: Scalars['Float']['input'];
  stationId: Scalars['String']['input'];
};

export type ICreateInventorySuccessResponse = {
  data: IInventoryModel;
  message: Scalars['String']['output'];
};

export type ICreateNotificationInput = {
  description: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type ICreateNotificationSuccessResponse = {
  data: INotificationModel;
  message: Scalars['String']['output'];
};

export type ICreateOtpInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type ICreateOtpSuccessResponse = {
  data: IOtpModel;
  message: Scalars['String']['output'];
};

export type ICreatePasswordResetInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type ICreatePasswordResetSuccessResponse = {
  data: IPasswordResetModel;
  message: Scalars['String']['output'];
};

export type ICreatePermissionInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type ICreatePermissionSuccessResponse = {
  data: IPermissionModel;
  message: Scalars['String']['output'];
};

export type ICreateRoleInput = {
  name: Scalars['String']['input'];
  permissions: Array<InputMaybe<ISelectCategory>>;
};

export type ICreateRoleSuccessResponse = {
  data: IRoleModel;
  message: Scalars['String']['output'];
};

export type ICreateSettingInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type ICreateSettingSuccessResponse = {
  data: ISettingModel;
  message: Scalars['String']['output'];
};

export type ICreateStationInput = {
  name: Scalars['String']['input'];
  type: IStationType;
};

export type ICreateStationSuccessResponse = {
  data: IStationModel;
  message: Scalars['String']['output'];
};

export type ICreateSuccessStringIdResponse = {
  id: Scalars['UUID']['output'];
  message: Scalars['String']['output'];
};

export type ICreateUserInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  middleName?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  roles?: InputMaybe<Array<InputMaybe<ISelectCategory>>>;
};

export type ICreateUserSuccessResponse = {
  data: IUserModel;
  message: Scalars['String']['output'];
};

export type IDeleteSuccessResponse = {
  message: Scalars['String']['output'];
};

export type IFileUploadModel = {
  id: Scalars['UUID']['output'];
  mimetype?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  originalName?: Maybe<Scalars['String']['output']>;
  size?: Maybe<Scalars['Int']['output']>;
  url?: Maybe<Scalars['URL']['output']>;
};

export type IInventoryModel = {
  catalogue: ICatalogueModel;
  catalogueId: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  quantity: Scalars['Float']['output'];
  station: IStationModel;
  stationId: Scalars['String']['output'];
};

export type ILoginResponse = {
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
  refreshTokenKey: Scalars['String']['output'];
  user?: Maybe<IUserModel>;
};

export type IMutation = {
  assignRoleToUser?: Maybe<ISuccessResponse>;
  changePassword?: Maybe<ISuccessResponse>;
  changePasswordUsingResetToken?: Maybe<ILoginResponse>;
  continueWithGoogle?: Maybe<ILoginResponse>;
  createActivityLog?: Maybe<ICreateActivityLogSuccessResponse>;
  createBrand?: Maybe<ICreateBrandSuccessResponse>;
  createCatalogue?: Maybe<ICreateCatalogueSuccessResponse>;
  createInventory?: Maybe<ICreateInventorySuccessResponse>;
  createNotification?: Maybe<ICreateNotificationSuccessResponse>;
  createOtp?: Maybe<ICreateOtpSuccessResponse>;
  createPasswordReset?: Maybe<ICreatePasswordResetSuccessResponse>;
  createPermission?: Maybe<ICreatePermissionSuccessResponse>;
  createRole?: Maybe<ICreateRoleSuccessResponse>;
  createSetting?: Maybe<ICreateSettingSuccessResponse>;
  createStation?: Maybe<ICreateStationSuccessResponse>;
  createUser?: Maybe<ICreateUserSuccessResponse>;
  deleteActivityLog?: Maybe<IDeleteSuccessResponse>;
  deleteBrand?: Maybe<IDeleteSuccessResponse>;
  deleteCatalogue?: Maybe<IDeleteSuccessResponse>;
  deleteInventory?: Maybe<IDeleteSuccessResponse>;
  deleteNotification?: Maybe<IDeleteSuccessResponse>;
  deleteOtp?: Maybe<IDeleteSuccessResponse>;
  deletePasswordReset?: Maybe<IDeleteSuccessResponse>;
  deletePermission?: Maybe<IDeleteSuccessResponse>;
  deleteRole?: Maybe<IDeleteSuccessResponse>;
  deleteSetting?: Maybe<IDeleteSuccessResponse>;
  deleteStation?: Maybe<IDeleteSuccessResponse>;
  deleteUser?: Maybe<IDeleteSuccessResponse>;
  givePermissionsToRole?: Maybe<ISuccessResponse>;
  healthCheck?: Maybe<Scalars['String']['output']>;
  loginWithPassword?: Maybe<ILoginResponse>;
  loginWithResetPasswordToken?: Maybe<ILoginResponse>;
  loginWithToken?: Maybe<ILoginResponse>;
  markNotificationAsRead?: Maybe<INotificationMarkedAsReadResponse>;
  register?: Maybe<ILoginResponse>;
  requestAccessToken?: Maybe<IAccessToken>;
  sendPasswordResetLinkEmail?: Maybe<ISuccessResponse>;
  sendPasswordResetOtpEmail?: Maybe<ISuccessResponse>;
  sendVerificationLinkEmail?: Maybe<ISuccessResponse>;
  signInWithGoogle?: Maybe<ILoginResponse>;
  signupGoogleUser?: Maybe<ILoginResponse>;
  testNotification?: Maybe<Scalars['String']['output']>;
  updateActivityLog?: Maybe<ICreateActivityLogSuccessResponse>;
  updateBrand?: Maybe<ICreateBrandSuccessResponse>;
  updateCatalogue?: Maybe<ICreateCatalogueSuccessResponse>;
  updateInventory?: Maybe<ICreateInventorySuccessResponse>;
  updateNotification?: Maybe<ICreateNotificationSuccessResponse>;
  updateOtp?: Maybe<ICreateOtpSuccessResponse>;
  updatePasswordReset?: Maybe<ICreatePasswordResetSuccessResponse>;
  updatePermission?: Maybe<ICreatePermissionSuccessResponse>;
  updateRole?: Maybe<ICreateRoleSuccessResponse>;
  updateSetting?: Maybe<ICreateSettingSuccessResponse>;
  updateStation?: Maybe<ICreateStationSuccessResponse>;
  updateUser?: Maybe<ICreateUserSuccessResponse>;
  uploadSingleFile: IUploadSuccessResponse;
  validateOtp?: Maybe<ILoginResponse>;
  validatePasswordResetToken?: Maybe<IValidatePasswordResetTokenResponse>;
  verifyEmail?: Maybe<ISuccessResponse>;
};


export type IMutationAssignRoleToUserArgs = {
  roles: Array<InputMaybe<ISelectCategory>>;
  userId: Scalars['String']['input'];
};


export type IMutationChangePasswordArgs = {
  oldPassword?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
  passwordConfirmation: Scalars['String']['input'];
};


export type IMutationChangePasswordUsingResetTokenArgs = {
  password: Scalars['String']['input'];
  passwordConfirmation: Scalars['String']['input'];
  token: Scalars['String']['input'];
};


export type IMutationContinueWithGoogleArgs = {
  token: Scalars['String']['input'];
};


export type IMutationCreateActivityLogArgs = {
  params?: InputMaybe<ICreateActivityLogInput>;
};


export type IMutationCreateBrandArgs = {
  params?: InputMaybe<ICreateBrandInput>;
};


export type IMutationCreateCatalogueArgs = {
  params?: InputMaybe<ICreateCatalogueInput>;
};


export type IMutationCreateInventoryArgs = {
  params?: InputMaybe<ICreateInventoryInput>;
};


export type IMutationCreateNotificationArgs = {
  params?: InputMaybe<ICreateNotificationInput>;
};


export type IMutationCreateOtpArgs = {
  name: Scalars['String']['input'];
};


export type IMutationCreatePasswordResetArgs = {
  name: Scalars['String']['input'];
};


export type IMutationCreatePermissionArgs = {
  name: Scalars['String']['input'];
};


export type IMutationCreateRoleArgs = {
  params?: InputMaybe<ICreateRoleInput>;
};


export type IMutationCreateSettingArgs = {
  params?: InputMaybe<ICreateSettingInput>;
};


export type IMutationCreateStationArgs = {
  params?: InputMaybe<ICreateStationInput>;
};


export type IMutationCreateUserArgs = {
  params?: InputMaybe<ICreateUserInput>;
};


export type IMutationDeleteActivityLogArgs = {
  id: Scalars['UUID']['input'];
};


export type IMutationDeleteBrandArgs = {
  id: Scalars['UUID']['input'];
};


export type IMutationDeleteCatalogueArgs = {
  id: Scalars['UUID']['input'];
};


export type IMutationDeleteInventoryArgs = {
  id: Scalars['UUID']['input'];
};


export type IMutationDeleteNotificationArgs = {
  id: Scalars['UUID']['input'];
};


export type IMutationDeleteOtpArgs = {
  id: Scalars['UUID']['input'];
};


export type IMutationDeletePasswordResetArgs = {
  id: Scalars['UUID']['input'];
};


export type IMutationDeletePermissionArgs = {
  id: Scalars['UUID']['input'];
};


export type IMutationDeleteRoleArgs = {
  id: Scalars['UUID']['input'];
};


export type IMutationDeleteSettingArgs = {
  id: Scalars['UUID']['input'];
};


export type IMutationDeleteStationArgs = {
  id: Scalars['UUID']['input'];
};


export type IMutationDeleteUserArgs = {
  id: Scalars['UUID']['input'];
};


export type IMutationGivePermissionsToRoleArgs = {
  permissions?: InputMaybe<Array<InputMaybe<ISelectCategory>>>;
  roleId?: InputMaybe<Scalars['String']['input']>;
};


export type IMutationLoginWithPasswordArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type IMutationLoginWithResetPasswordTokenArgs = {
  token: Scalars['String']['input'];
};


export type IMutationLoginWithTokenArgs = {
  token: Scalars['String']['input'];
};


export type IMutationMarkNotificationAsReadArgs = {
  notifications: Array<InputMaybe<ISelectCategory>>;
};


export type IMutationRegisterArgs = {
  acceptTerms: Scalars['Boolean']['input'];
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  passwordConfirmation: Scalars['String']['input'];
};


export type IMutationRequestAccessTokenArgs = {
  refreshToken: Scalars['String']['input'];
};


export type IMutationSendPasswordResetLinkEmailArgs = {
  email: Scalars['String']['input'];
};


export type IMutationSendPasswordResetOtpEmailArgs = {
  email: Scalars['String']['input'];
};


export type IMutationSignInWithGoogleArgs = {
  token: Scalars['String']['input'];
};


export type IMutationSignupGoogleUserArgs = {
  token: Scalars['String']['input'];
};


export type IMutationUpdateActivityLogArgs = {
  id: Scalars['UUID']['input'];
  params?: InputMaybe<IUpdateActivityLogInput>;
};


export type IMutationUpdateBrandArgs = {
  id: Scalars['UUID']['input'];
  params?: InputMaybe<IUpdateBrandInput>;
};


export type IMutationUpdateCatalogueArgs = {
  id: Scalars['UUID']['input'];
  params?: InputMaybe<IUpdateCatalogueInput>;
};


export type IMutationUpdateInventoryArgs = {
  id: Scalars['UUID']['input'];
  params?: InputMaybe<IUpdateInventoryInput>;
};


export type IMutationUpdateNotificationArgs = {
  id: Scalars['UUID']['input'];
  params?: InputMaybe<IUpdateNotificationInput>;
};


export type IMutationUpdateOtpArgs = {
  id: Scalars['UUID']['input'];
  params?: InputMaybe<IUpdateOtpInput>;
};


export type IMutationUpdatePasswordResetArgs = {
  id: Scalars['UUID']['input'];
  params?: InputMaybe<IUpdatePasswordResetInput>;
};


export type IMutationUpdatePermissionArgs = {
  id: Scalars['UUID']['input'];
  params?: InputMaybe<IUpdatePermissionInput>;
};


export type IMutationUpdateRoleArgs = {
  id: Scalars['UUID']['input'];
  params?: InputMaybe<IUpdateRoleInput>;
};


export type IMutationUpdateSettingArgs = {
  id: Scalars['UUID']['input'];
  params?: InputMaybe<IUpdateSettingInput>;
};


export type IMutationUpdateStationArgs = {
  id: Scalars['UUID']['input'];
  params?: InputMaybe<IUpdateStationInput>;
};


export type IMutationUpdateUserArgs = {
  id: Scalars['UUID']['input'];
  params?: InputMaybe<IUpdateUserInput>;
};


export type IMutationUploadSingleFileArgs = {
  file: Scalars['Upload']['input'];
};


export type IMutationValidateOtpArgs = {
  identifier: Scalars['String']['input'];
  token: Scalars['String']['input'];
};


export type IMutationValidatePasswordResetTokenArgs = {
  token?: InputMaybe<Scalars['String']['input']>;
};


export type IMutationVerifyEmailArgs = {
  token: Scalars['String']['input'];
};

export type INotificationCreatedResponse = {
  notification?: Maybe<INotificationUserModel>;
  stats?: Maybe<INotificationStat>;
};

export type INotificationKey = {
  notificationKey: Scalars['String']['output'];
};

export type INotificationMarkedAsReadResponse = {
  data?: Maybe<INotificationStat>;
  message?: Maybe<Scalars['String']['output']>;
};

export type INotificationModel = {
  createdAt: Scalars['String']['output'];
  description: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type INotificationStat = {
  read: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
  unread: Scalars['Int']['output'];
};

export type INotificationUserModel = {
  createdAt: Scalars['String']['output'];
  description: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  isRead: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type IOtpModel = {
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
};

export type IPaginatedActivityLog = {
  items?: Maybe<Array<Maybe<IActivityLogModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPaginatedActivityLogUserModel = {
  items?: Maybe<Array<Maybe<IActivityLogUserModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPaginatedBrand = {
  items?: Maybe<Array<Maybe<IBrandModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPaginatedCatalogue = {
  items?: Maybe<Array<Maybe<ICatalogueModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPaginatedFileUpload = {
  items?: Maybe<Array<Maybe<IFileUploadModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPaginatedInventory = {
  items?: Maybe<Array<Maybe<IInventoryModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPaginatedNotification = {
  items?: Maybe<Array<Maybe<INotificationModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPaginatedOtp = {
  items?: Maybe<Array<Maybe<IOtpModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPaginatedPasswordReset = {
  items?: Maybe<Array<Maybe<IPasswordResetModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPaginatedPermission = {
  items?: Maybe<Array<Maybe<IPermissionModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPaginatedRole = {
  items?: Maybe<Array<Maybe<IRoleModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPaginatedSetting = {
  items?: Maybe<Array<Maybe<ISettingModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPaginatedStation = {
  items?: Maybe<Array<Maybe<IStationModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPaginatedUser = {
  items?: Maybe<Array<Maybe<IUserModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPaginatedUserNotification = {
  items?: Maybe<Array<Maybe<INotificationUserModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPaginatedUserRoles = {
  items?: Maybe<Array<Maybe<IRoleModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPagination = {
  totalItems: Scalars['Int']['output'];
};

export type IPasswordResetModel = {
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
};

export type IPermissionModel = {
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
};

export type IQuery = {
  activityLog?: Maybe<IActivityLogModel>;
  activityLogs: IPaginatedActivityLog;
  authenticatedUserActivityLogs: IPaginatedActivityLogUserModel;
  authenticatedUserNotificationStats?: Maybe<INotificationStat>;
  authenticatedUserNotifications?: Maybe<IPaginatedUserNotification>;
  brand?: Maybe<IBrandModel>;
  brands: IPaginatedBrand;
  catalogue?: Maybe<ICatalogueModel>;
  catalogues: IPaginatedCatalogue;
  fileUploads: IPaginatedFileUpload;
  healthCheck?: Maybe<Scalars['String']['output']>;
  inventories: IPaginatedInventory;
  inventory?: Maybe<IInventoryModel>;
  notification?: Maybe<INotificationModel>;
  notifications: IPaginatedNotification;
  otp?: Maybe<IOtpModel>;
  otps: IPaginatedOtp;
  passwordReset?: Maybe<IPasswordResetModel>;
  passwordResets: IPaginatedPasswordReset;
  permission?: Maybe<IPermissionModel>;
  permissions: IPaginatedPermission;
  role?: Maybe<IRoleModel>;
  roles: IPaginatedRole;
  setting?: Maybe<ISettingModel>;
  settings: IPaginatedSetting;
  station?: Maybe<IStationModel>;
  stations: IPaginatedStation;
  user?: Maybe<IUserModel>;
  userCount: IUserCount;
  userRoles?: Maybe<IPaginatedUserRoles>;
  users: IPaginatedUser;
};


export type IQueryActivityLogArgs = {
  id: Scalars['UUID']['input'];
};


export type IQueryActivityLogsArgs = {
  query?: InputMaybe<IQueryParams>;
};


export type IQueryAuthenticatedUserActivityLogsArgs = {
  query?: InputMaybe<IQueryParams>;
};


export type IQueryAuthenticatedUserNotificationsArgs = {
  query?: InputMaybe<IQueryParams>;
};


export type IQueryBrandArgs = {
  id: Scalars['UUID']['input'];
};


export type IQueryBrandsArgs = {
  query?: InputMaybe<IQueryParams>;
};


export type IQueryCatalogueArgs = {
  id: Scalars['UUID']['input'];
};


export type IQueryCataloguesArgs = {
  query?: InputMaybe<IQueryParams>;
};


export type IQueryFileUploadsArgs = {
  query?: InputMaybe<IQueryParams>;
};


export type IQueryInventoriesArgs = {
  query?: InputMaybe<IQueryParams>;
};


export type IQueryInventoryArgs = {
  id: Scalars['UUID']['input'];
};


export type IQueryNotificationArgs = {
  id: Scalars['UUID']['input'];
};


export type IQueryNotificationsArgs = {
  query?: InputMaybe<IQueryParams>;
};


export type IQueryOtpArgs = {
  id: Scalars['UUID']['input'];
};


export type IQueryOtpsArgs = {
  query?: InputMaybe<IQueryParams>;
};


export type IQueryPasswordResetArgs = {
  id: Scalars['UUID']['input'];
};


export type IQueryPasswordResetsArgs = {
  query?: InputMaybe<IQueryParams>;
};


export type IQueryPermissionArgs = {
  id: Scalars['UUID']['input'];
};


export type IQueryPermissionsArgs = {
  query?: InputMaybe<IQueryParams>;
};


export type IQueryRoleArgs = {
  id: Scalars['UUID']['input'];
};


export type IQueryRolesArgs = {
  query?: InputMaybe<IQueryParams>;
};


export type IQuerySettingArgs = {
  id: Scalars['UUID']['input'];
};


export type IQuerySettingsArgs = {
  query?: InputMaybe<IQueryParams>;
};


export type IQueryStationArgs = {
  id: Scalars['UUID']['input'];
};


export type IQueryStationsArgs = {
  query?: InputMaybe<IQueryParams>;
};


export type IQueryUserArgs = {
  id: Scalars['UUID']['input'];
};


export type IQueryUserRolesArgs = {
  userId?: InputMaybe<Scalars['UUID']['input']>;
};


export type IQueryUsersArgs = {
  query?: InputMaybe<IQueryParams>;
};

export enum IQueryOperatorEnum {
  Between = 'BETWEEN',
  Contains = 'CONTAINS',
  Equals = 'EQUALS',
  GreaterThan = 'GREATER_THAN',
  In = 'IN',
  LessThan = 'LESS_THAN'
}

export type IQueryParams = {
  currentPage?: InputMaybe<Scalars['Int']['input']>;
  filters?: InputMaybe<Array<InputMaybe<IQueryParamsFilter>>>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  searchTerm?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortByDirection?: InputMaybe<ISortByEnum>;
};

export type IQueryParamsFilter = {
  field?: InputMaybe<Scalars['String']['input']>;
  operator?: InputMaybe<IQueryOperatorEnum>;
  value?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type IRoleModel = {
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  permissions?: Maybe<Array<Maybe<IPermissionModel>>>;
};

export type ISelectCategory = {
  id: Scalars['UUID']['input'];
};

export type ISelectCategoryString = {
  id: Scalars['UUID']['input'];
};

export type ISettingModel = {
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
};

export enum ISortByEnum {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type IStationModel = {
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  type: IStationType;
};

export enum IStationType {
  Dealer = 'DEALER',
  Depot = 'DEPOT'
}

export type ISubscription = {
  healthCheck?: Maybe<Scalars['String']['output']>;
  notificationCreated?: Maybe<INotificationCreatedResponse>;
  refreshedAccessToken?: Maybe<IAccessToken>;
  resetPasswordNotification?: Maybe<ISuccessResponse>;
};


export type ISubscriptionRefreshedAccessTokenArgs = {
  refreshToken: Scalars['String']['input'];
};


export type ISubscriptionResetPasswordNotificationArgs = {
  notificationKey?: InputMaybe<Scalars['String']['input']>;
};

export type ISuccessResponse = {
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type IUpdateActivityLogInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type IUpdateBrandCatalogueInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
  name: Scalars['String']['input'];
  pricePerUnit?: InputMaybe<Scalars['Float']['input']>;
  quantityPerUnit: Scalars['Float']['input'];
  unit: ICatalogueUnit;
};

export type IUpdateBrandInput = {
  catalogues?: InputMaybe<Array<InputMaybe<IUpdateBrandCatalogueInput>>>;
  companyName?: InputMaybe<Scalars['String']['input']>;
  images?: InputMaybe<Array<InputMaybe<ISelectCategory>>>;
  name: Scalars['String']['input'];
};

export type IUpdateCatalogueInput = {
  brandId: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  pricePerUnit?: InputMaybe<Scalars['Float']['input']>;
  quantityPerUnit: Scalars['Float']['input'];
  unit: ICatalogueUnit;
};

export type IUpdateInventoryInput = {
  catalogueId: Scalars['String']['input'];
  quantity: Scalars['Float']['input'];
  stationId: Scalars['String']['input'];
};

export type IUpdateNotificationInput = {
  description: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type IUpdateOtpInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type IUpdatePasswordResetInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type IUpdatePermissionInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type IUpdateRoleInput = {
  name: Scalars['String']['input'];
};

export type IUpdateSettingInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type IUpdateStationInput = {
  name: Scalars['String']['input'];
  type?: InputMaybe<IStationType>;
};

export type IUpdateUserInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  middleName?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  roles?: InputMaybe<Array<InputMaybe<ISelectCategory>>>;
};

export type IUploadSuccessResponse = {
  data?: Maybe<IFileUploadModel>;
  message?: Maybe<Scalars['String']['output']>;
};

export type IUserCount = {
  count: Scalars['Int']['output'];
};

export type IUserModel = {
  createdAt?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  emailVerifiedAt?: Maybe<Scalars['String']['output']>;
  firstName: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  lastName: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  phoneVerifiedAt?: Maybe<Scalars['String']['output']>;
  profilePhotoLink?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type IValidatePasswordResetTokenResponse = {
  user?: Maybe<IUserModel>;
};
