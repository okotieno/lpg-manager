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
  createdAt: Scalars['DateTime']['output'];
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
  createdAt: Scalars['DateTime']['output'];
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

export type ICartCatalogueInput = {
  id: Scalars['UUID']['input'];
  inventoryId: Scalars['UUID']['input'];
  quantity: Scalars['Float']['input'];
};

export type ICartCatalogueModel = {
  catalogue: ICatalogueModel;
  catalogueId: Scalars['UUID']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['UUID']['output'];
  inventory: IInventoryModel;
  quantity: Scalars['Float']['output'];
};

export type ICartModel = {
  expiresAt: Scalars['DateTime']['output'];
  id: Scalars['UUID']['output'];
  items: Array<Maybe<ICartCatalogueModel>>;
  status: ICartStatus;
  totalPrice?: Maybe<Scalars['Float']['output']>;
  totalQuantity?: Maybe<Scalars['Int']['output']>;
};

export enum ICartStatus {
  Completed = 'COMPLETED',
  Pending = 'PENDING'
}

export type ICatalogueModel = {
  brand: IBrandModel;
  brandId: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  images?: Maybe<Array<Maybe<IFileUploadModel>>>;
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

export type ICreateCartInput = {
  dealerId: Scalars['UUID']['input'];
  items: Array<InputMaybe<ICartCatalogueInput>>;
};

export type ICreateCartResponse = {
  data: ICartModel;
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

export type ICreateDispatchInput = {
  dispatchDate: Scalars['DateTime']['input'];
  driverId: Scalars['UUID']['input'];
  orderIds: Array<Scalars['UUID']['input']>;
  transporterId: Scalars['UUID']['input'];
  vehicleId: Scalars['UUID']['input'];
};

export type ICreateDispatchSuccessResponse = {
  data: IDispatchModel;
  message: Scalars['String']['output'];
};

export type ICreateDriverInput = {
  licenseNumber: Scalars['String']['input'];
  name: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  transporterId: Scalars['UUID']['input'];
};

export type ICreateDriverInventoryInput = {
  assignedAt?: InputMaybe<Scalars['DateTime']['input']>;
  dispatchId: Scalars['UUID']['input'];
  driverId: Scalars['UUID']['input'];
  inventoryItemId: Scalars['UUID']['input'];
  status: IDriverInventoryStatus;
};

export type ICreateDriverInventorySuccessResponse = {
  data: IDriverInventoryModel;
  message: Scalars['String']['output'];
};

export type ICreateDriverSuccessResponse = {
  data: IDriverModel;
  message: Scalars['String']['output'];
};

export type ICreateInventoryChangeInput = {
  inventoryId: Scalars['UUID']['input'];
  quantity: Scalars['PositiveFloat']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
  referenceType?: InputMaybe<IReferenceType>;
  type?: InputMaybe<IInventoryChangeType>;
};

export type ICreateInventoryChangeSuccessResponse = {
  data: IInventoryChangeModel;
  message: Scalars['String']['output'];
};

export type ICreateInventoryInput = {
  batchNumber: Scalars['String']['input'];
  catalogueId: Scalars['String']['input'];
  expiryDate?: InputMaybe<Scalars['DateTime']['input']>;
  manufactureDate?: InputMaybe<Scalars['DateTime']['input']>;
  quantity: Scalars['Float']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
  serialNumbers?: InputMaybe<Array<Scalars['String']['input']>>;
  stationId: Scalars['String']['input'];
};

export type ICreateInventoryInputDto = {
  batchNumber?: InputMaybe<Scalars['String']['input']>;
  catalogueId: Scalars['ID']['input'];
  expiryDate?: InputMaybe<Scalars['String']['input']>;
  manufactureDate?: InputMaybe<Scalars['String']['input']>;
  quantity: Scalars['Int']['input'];
  reason: Scalars['String']['input'];
  serialNumbers?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  stationId: Scalars['ID']['input'];
};

export type ICreateInventoryItemInput = {
  batchNumber: Scalars['String']['input'];
  expiryDate?: InputMaybe<Scalars['DateTime']['input']>;
  inventoryId: Scalars['UUID']['input'];
  manufactureDate?: InputMaybe<Scalars['DateTime']['input']>;
  serialNumber?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<IInventoryItemStatus>;
};

export type ICreateInventoryItemSuccessResponse = {
  data: IInventoryItemModel;
  message: Scalars['String']['output'];
};

export type ICreateInventorySuccessResponse = {
  data: IInventoryChangeModel;
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

export type ICreateOrderInput = {
  items: Array<InputMaybe<IOrderItemInput>>;
};

export type ICreateOrderResponse = {
  data: IOrderModel;
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
  brands?: InputMaybe<Array<ISelectCategory>>;
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

export type ICreateTransporterInput = {
  contactPerson: Scalars['String']['input'];
  drivers?: InputMaybe<Array<InputMaybe<ITransporterDriverInput>>>;
  name: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  vehicles?: InputMaybe<Array<InputMaybe<ITransporterVehicleInput>>>;
};

export type ICreateTransporterSuccessResponse = {
  data: ITransporterModel;
  message: Scalars['String']['output'];
};

export type ICreateUserInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  middleName?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  roles?: InputMaybe<Array<InputMaybe<IUserRoleInput>>>;
};

export type ICreateUserSuccessResponse = {
  data: IUserModel;
  message: Scalars['String']['output'];
};

export type ICreateVehicleInput = {
  capacity: Scalars['Float']['input'];
  registrationNumber: Scalars['String']['input'];
  transporterId: Scalars['UUID']['input'];
  type: Scalars['String']['input'];
};

export type ICreateVehicleSuccessResponse = {
  data?: Maybe<IVehicleModel>;
  message: Scalars['String']['output'];
};

export type IDeleteSuccessResponse = {
  message: Scalars['String']['output'];
};

export type IDispatchModel = {
  createdAt: Scalars['DateTime']['output'];
  depotToDriverConfirmedAt?: Maybe<Scalars['DateTime']['output']>;
  dispatchDate: Scalars['DateTime']['output'];
  driver: IDriverModel;
  driverFromDepotConfirmedAt?: Maybe<Scalars['DateTime']['output']>;
  driverId: Scalars['UUID']['output'];
  id: Scalars['UUID']['output'];
  orders: Array<IOrderModel>;
  status: IDispatchStatus;
  transporter: ITransporterModel;
  transporterId: Scalars['UUID']['output'];
  updatedAt: Scalars['DateTime']['output'];
  vehicle: IVehicleModel;
  vehicleId: Scalars['UUID']['output'];
};

export enum IDispatchStatus {
  Completed = 'COMPLETED',
  DealerFromDriverConfirmed = 'DEALER_FROM_DRIVER_CONFIRMED',
  Delivering = 'DELIVERING',
  DepotToDriverConfirmed = 'DEPOT_TO_DRIVER_CONFIRMED',
  DriverFromDepotConfirmed = 'DRIVER_FROM_DEPOT_CONFIRMED',
  Initiated = 'INITIATED',
  InTransit = 'IN_TRANSIT',
  Pending = 'PENDING'
}

export type IDriverInventoryModel = {
  assignedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  dispatchId: Scalars['UUID']['output'];
  driverId: Scalars['UUID']['output'];
  id: Scalars['UUID']['output'];
  inventoryItem: IInventoryItemModel;
  inventoryItemId: Scalars['UUID']['output'];
  returnedAt?: Maybe<Scalars['DateTime']['output']>;
  status: IDriverInventoryStatus;
  updatedAt: Scalars['DateTime']['output'];
};

export enum IDriverInventoryStatus {
  Assigned = 'ASSIGNED',
  DealerFromDriverConfirmed = 'DEALER_FROM_DRIVER_CONFIRMED',
  Delivered = 'DELIVERED',
  DepotToDriverConfirmed = 'DEPOT_TO_DRIVER_CONFIRMED',
  DriverToDealerConfirmed = 'DRIVER_TO_DEALER_CONFIRMED',
  InTransit = 'IN_TRANSIT',
  Returned = 'RETURNED'
}

export type IDriverModel = {
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['UUID']['output'];
  licenseNumber: Scalars['String']['output'];
  transporter: ITransporterModel;
  transporterId: Scalars['UUID']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: IUserModel;
  vehicles?: Maybe<Array<IVehicleModel>>;
};

export type IEmptyCylindersScanConfirmInput = {
  catalogueId?: InputMaybe<Scalars['UUID']['input']>;
  quantity?: InputMaybe<Scalars['PositiveInt']['input']>;
};

export type IFileUploadModel = {
  id: Scalars['UUID']['output'];
  mimetype?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  originalName?: Maybe<Scalars['String']['output']>;
  size?: Maybe<Scalars['Int']['output']>;
  url?: Maybe<Scalars['URL']['output']>;
};

export type IInventoryChangeModel = {
  id: Scalars['UUID']['output'];
  inventory: IInventoryModel;
  inventoryId: Scalars['UUID']['output'];
  items: Array<IInventoryItemModel>;
  quantity: Scalars['PositiveFloat']['output'];
  reason?: Maybe<Scalars['String']['output']>;
  referenceType?: Maybe<IReferenceType>;
  type?: Maybe<IInventoryChangeType>;
};

export enum IInventoryChangeType {
  Decrease = 'DECREASE',
  Increase = 'INCREASE'
}

export type IInventoryItemModel = {
  batchNumber: Scalars['String']['output'];
  createdBy: Scalars['UUID']['output'];
  creator: IUserModel;
  expiryDate?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['UUID']['output'];
  inventory: IInventoryModel;
  inventoryChange: IInventoryChangeModel;
  inventoryId: Scalars['UUID']['output'];
  manufactureDate?: Maybe<Scalars['DateTime']['output']>;
  serialNumber?: Maybe<Scalars['String']['output']>;
  status: IInventoryItemStatus;
};

export enum IInventoryItemStatus {
  Available = 'AVAILABLE',
  Damaged = 'DAMAGED',
  Reserved = 'RESERVED',
  Returned = 'RETURNED',
  Sold = 'SOLD'
}

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
  addItemToCart: ICreateCartResponse;
  assignRoleToUser?: Maybe<ISuccessResponse>;
  changePassword?: Maybe<ISuccessResponse>;
  changePasswordUsingResetToken?: Maybe<ILoginResponse>;
  completeCart: ICreateCartResponse;
  continueWithGoogle?: Maybe<ILoginResponse>;
  createActivityLog?: Maybe<ICreateActivityLogSuccessResponse>;
  createBrand?: Maybe<ICreateBrandSuccessResponse>;
  createCart: ICreateCartResponse;
  createCatalogue?: Maybe<ICreateCatalogueSuccessResponse>;
  createDispatch: ICreateDispatchSuccessResponse;
  createDriver: ICreateDriverSuccessResponse;
  createDriverInventory: ICreateDriverInventorySuccessResponse;
  createInventory?: Maybe<ICreateInventorySuccessResponse>;
  createInventoryChange?: Maybe<ICreateInventoryChangeSuccessResponse>;
  createInventoryItem: ICreateInventoryItemSuccessResponse;
  createNotification?: Maybe<ICreateNotificationSuccessResponse>;
  createOrder: ICreateOrderResponse;
  createOtp?: Maybe<ICreateOtpSuccessResponse>;
  createPasswordReset?: Maybe<ICreatePasswordResetSuccessResponse>;
  createPermission?: Maybe<ICreatePermissionSuccessResponse>;
  createRole?: Maybe<ICreateRoleSuccessResponse>;
  createSetting?: Maybe<ICreateSettingSuccessResponse>;
  createStation?: Maybe<ICreateStationSuccessResponse>;
  createTransporter: ICreateTransporterSuccessResponse;
  createUser?: Maybe<ICreateUserSuccessResponse>;
  createVehicle: ICreateVehicleSuccessResponse;
  deleteActivityLog: IDeleteSuccessResponse;
  deleteBrand: IDeleteSuccessResponse;
  deleteCatalogue: IDeleteSuccessResponse;
  deleteDispatch: IDeleteSuccessResponse;
  deleteDriver: IDeleteSuccessResponse;
  deleteDriverInventory: IDeleteSuccessResponse;
  deleteInventory: IDeleteSuccessResponse;
  deleteInventoryChange: IDeleteSuccessResponse;
  deleteInventoryItem: IDeleteSuccessResponse;
  deleteNotification: IDeleteSuccessResponse;
  deleteOrder: IDeleteSuccessResponse;
  deleteOtp: IDeleteSuccessResponse;
  deletePasswordReset: IDeleteSuccessResponse;
  deletePermission: IDeleteSuccessResponse;
  deleteRole: IDeleteSuccessResponse;
  deleteSetting: IDeleteSuccessResponse;
  deleteStation: IDeleteSuccessResponse;
  deleteTransporter: IDeleteSuccessResponse;
  deleteUser: IDeleteSuccessResponse;
  deleteVehicle: IDeleteSuccessResponse;
  givePermissionsToRole?: Maybe<ISuccessResponse>;
  healthCheck?: Maybe<Scalars['String']['output']>;
  loginWithPassword?: Maybe<ILoginResponse>;
  loginWithResetPasswordToken?: Maybe<ILoginResponse>;
  loginWithToken?: Maybe<ILoginResponse>;
  markNotificationAsRead?: Maybe<INotificationMarkedAsReadResponse>;
  register?: Maybe<ILoginResponse>;
  removeItemFromCart: ICreateCartResponse;
  requestAccessToken?: Maybe<IAccessToken>;
  scanConfirm: ICreateDispatchSuccessResponse;
  sendPasswordResetLinkEmail?: Maybe<ISuccessResponse>;
  sendPasswordResetOtpEmail?: Maybe<ISuccessResponse>;
  sendVerificationLinkEmail?: Maybe<ISuccessResponse>;
  signInWithGoogle?: Maybe<ILoginResponse>;
  signupGoogleUser?: Maybe<ILoginResponse>;
  testNotification?: Maybe<Scalars['String']['output']>;
  updateActivityLog?: Maybe<ICreateActivityLogSuccessResponse>;
  updateBrand?: Maybe<ICreateBrandSuccessResponse>;
  updateCatalogue?: Maybe<ICreateCatalogueSuccessResponse>;
  updateDispatch: ICreateDispatchSuccessResponse;
  updateDriver: ICreateDriverSuccessResponse;
  updateDriverInventory?: Maybe<ICreateDriverInventorySuccessResponse>;
  updateInventory?: Maybe<ICreateInventorySuccessResponse>;
  updateInventoryChange?: Maybe<ICreateInventoryChangeSuccessResponse>;
  updateInventoryItem: ICreateInventoryItemSuccessResponse;
  updateInventoryItemStatus: IInventoryItemModel;
  updateItemQuantity: ICreateCartResponse;
  updateNotification?: Maybe<ICreateNotificationSuccessResponse>;
  updateOrder: IUpdateOrderResponse;
  updateOrderStatus: IUpdateOrderResponse;
  updateOtp?: Maybe<ICreateOtpSuccessResponse>;
  updatePasswordReset?: Maybe<ICreatePasswordResetSuccessResponse>;
  updatePermission?: Maybe<ICreatePermissionSuccessResponse>;
  updateRole?: Maybe<ICreateRoleSuccessResponse>;
  updateSetting?: Maybe<ICreateSettingSuccessResponse>;
  updateStation?: Maybe<ICreateStationSuccessResponse>;
  updateTransporter: ICreateTransporterSuccessResponse;
  updateUser?: Maybe<ICreateUserSuccessResponse>;
  updateVehicle: ICreateVehicleSuccessResponse;
  uploadSingleFile: IUploadSuccessResponse;
  validateOtp?: Maybe<ILoginResponse>;
  validatePasswordResetToken?: Maybe<IValidatePasswordResetTokenResponse>;
  verifyEmail?: Maybe<ISuccessResponse>;
};


export type IMutationAddItemToCartArgs = {
  cartId?: InputMaybe<Scalars['UUID']['input']>;
  inventoryId: Scalars['UUID']['input'];
  quantity: Scalars['Int']['input'];
};


export type IMutationAssignRoleToUserArgs = {
  roles: Array<InputMaybe<IUserRoleInput>>;
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


export type IMutationCompleteCartArgs = {
  cartId: Scalars['UUID']['input'];
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


export type IMutationCreateCartArgs = {
  params?: InputMaybe<ICreateCartInput>;
};


export type IMutationCreateCatalogueArgs = {
  params?: InputMaybe<ICreateCatalogueInput>;
};


export type IMutationCreateDispatchArgs = {
  params: ICreateDispatchInput;
};


export type IMutationCreateDriverArgs = {
  params: ICreateDriverInput;
};


export type IMutationCreateDriverInventoryArgs = {
  params: ICreateDriverInventoryInput;
};


export type IMutationCreateInventoryArgs = {
  params?: InputMaybe<ICreateInventoryInput>;
};


export type IMutationCreateInventoryChangeArgs = {
  params?: InputMaybe<ICreateInventoryChangeInput>;
};


export type IMutationCreateInventoryItemArgs = {
  params: ICreateInventoryItemInput;
};


export type IMutationCreateNotificationArgs = {
  params?: InputMaybe<ICreateNotificationInput>;
};


export type IMutationCreateOrderArgs = {
  params?: InputMaybe<ICreateOrderInput>;
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


export type IMutationCreateTransporterArgs = {
  params: ICreateTransporterInput;
};


export type IMutationCreateUserArgs = {
  params?: InputMaybe<ICreateUserInput>;
};


export type IMutationCreateVehicleArgs = {
  params: ICreateVehicleInput;
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


export type IMutationDeleteDispatchArgs = {
  id: Scalars['UUID']['input'];
};


export type IMutationDeleteDriverArgs = {
  id: Scalars['UUID']['input'];
};


export type IMutationDeleteDriverInventoryArgs = {
  id: Scalars['UUID']['input'];
};


export type IMutationDeleteInventoryArgs = {
  id: Scalars['UUID']['input'];
};


export type IMutationDeleteInventoryChangeArgs = {
  id: Scalars['UUID']['input'];
};


export type IMutationDeleteInventoryItemArgs = {
  id: Scalars['UUID']['input'];
};


export type IMutationDeleteNotificationArgs = {
  id: Scalars['UUID']['input'];
};


export type IMutationDeleteOrderArgs = {
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


export type IMutationDeleteTransporterArgs = {
  id: Scalars['UUID']['input'];
};


export type IMutationDeleteUserArgs = {
  id: Scalars['UUID']['input'];
};


export type IMutationDeleteVehicleArgs = {
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


export type IMutationRemoveItemFromCartArgs = {
  cartCatalogueId: Scalars['UUID']['input'];
  cartId: Scalars['UUID']['input'];
};


export type IMutationRequestAccessTokenArgs = {
  refreshToken: Scalars['String']['input'];
};


export type IMutationScanConfirmArgs = {
  params: IScanConfirmInput;
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


export type IMutationUpdateDispatchArgs = {
  id: Scalars['UUID']['input'];
  params: IUpdateDispatchInput;
};


export type IMutationUpdateDriverArgs = {
  id: Scalars['UUID']['input'];
  params: IUpdateDriverInput;
};


export type IMutationUpdateDriverInventoryArgs = {
  id: Scalars['UUID']['input'];
  params?: InputMaybe<IUpdateDriverInventoryInput>;
};


export type IMutationUpdateInventoryArgs = {
  id: Scalars['UUID']['input'];
  params?: InputMaybe<IUpdateInventoryInput>;
};


export type IMutationUpdateInventoryChangeArgs = {
  id: Scalars['UUID']['input'];
  params?: InputMaybe<IUpdateInventoryChangeInput>;
};


export type IMutationUpdateInventoryItemArgs = {
  id: Scalars['UUID']['input'];
  params: IUpdateInventoryItemInput;
};


export type IMutationUpdateInventoryItemStatusArgs = {
  params: IUpdateInventoryItemStatusInput;
};


export type IMutationUpdateItemQuantityArgs = {
  cartCatalogueId: Scalars['UUID']['input'];
  cartId: Scalars['UUID']['input'];
  quantity: Scalars['Int']['input'];
};


export type IMutationUpdateNotificationArgs = {
  id: Scalars['UUID']['input'];
  params?: InputMaybe<IUpdateNotificationInput>;
};


export type IMutationUpdateOrderArgs = {
  id: Scalars['UUID']['input'];
  params?: InputMaybe<IUpdateOrderInput>;
};


export type IMutationUpdateOrderStatusArgs = {
  id: Scalars['UUID']['input'];
  params: IUpdateOrderStatusInput;
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


export type IMutationUpdateTransporterArgs = {
  id: Scalars['UUID']['input'];
  params: IUpdateTransporterInput;
};


export type IMutationUpdateUserArgs = {
  id: Scalars['UUID']['input'];
  params?: InputMaybe<IUpdateUserInput>;
};


export type IMutationUpdateVehicleArgs = {
  id: Scalars['UUID']['input'];
  params: IUpdateVehicleInput;
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
  createdAt: Scalars['DateTime']['output'];
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
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  isRead: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export enum IOrderDispatchStatus {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  DealerFromDriverConfirmed = 'DEALER_FROM_DRIVER_CONFIRMED',
  DriverToDealerConfirmed = 'DRIVER_TO_DEALER_CONFIRMED',
  Pending = 'PENDING',
  Rejected = 'REJECTED'
}

export type IOrderItem = {
  catalogue: ICatalogueModel;
  catalogueId: Scalars['UUID']['output'];
  id: Scalars['UUID']['output'];
  quantity: Scalars['Int']['output'];
};

export type IOrderItemInput = {
  catalogueId: Scalars['UUID']['input'];
  quantity: Scalars['Int']['input'];
};

export type IOrderModel = {
  createdAt: Scalars['DateTime']['output'];
  dealer: IStationModel;
  depot: IStationModel;
  dispatch?: Maybe<IDispatchModel>;
  dispatchStatus?: Maybe<IOrderDispatchStatus>;
  id: Scalars['UUID']['output'];
  items: Array<Maybe<IOrderItem>>;
  status: IOrderStatus;
  totalPrice: Scalars['Float']['output'];
  totalQuantity: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export enum IOrderStatus {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Confirmed = 'CONFIRMED',
  Delivering = 'DELIVERING',
  Pending = 'PENDING',
  Rejected = 'REJECTED',
  Returned = 'RETURNED'
}

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

export type IPaginatedCart = {
  items?: Maybe<Array<Maybe<ICartModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPaginatedCatalogue = {
  items?: Maybe<Array<Maybe<ICatalogueModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPaginatedDispatch = {
  items?: Maybe<Array<Maybe<IDispatchModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPaginatedDriver = {
  items?: Maybe<Array<Maybe<IDriverModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPaginatedDriverInventory = {
  items?: Maybe<Array<Maybe<IDriverInventoryModel>>>;
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

export type IPaginatedInventoryChange = {
  items?: Maybe<Array<Maybe<IInventoryChangeModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPaginatedInventoryItem = {
  items?: Maybe<Array<Maybe<IInventoryItemModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPaginatedNotification = {
  items?: Maybe<Array<Maybe<INotificationModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPaginatedOrder = {
  items?: Maybe<Array<Maybe<IOrderModel>>>;
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

export type IPaginatedTransporter = {
  items?: Maybe<Array<Maybe<ITransporterModel>>>;
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

export type IPaginatedVehicle = {
  items?: Maybe<Array<Maybe<IVehicleModel>>>;
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
  cart?: Maybe<ICartModel>;
  carts: IPaginatedCart;
  catalogue?: Maybe<ICatalogueModel>;
  catalogues: IPaginatedCatalogue;
  dispatch?: Maybe<IDispatchModel>;
  dispatches: IPaginatedDispatch;
  driver?: Maybe<IDriverModel>;
  driverInventories: IPaginatedDriverInventory;
  driverInventory?: Maybe<IDriverInventoryModel>;
  drivers: IPaginatedDriver;
  fileUploads: IPaginatedFileUpload;
  healthCheck?: Maybe<Scalars['String']['output']>;
  inventories: IPaginatedInventory;
  inventory?: Maybe<IInventoryModel>;
  inventoryChange?: Maybe<IInventoryChangeModel>;
  inventoryChanges: IPaginatedInventoryChange;
  inventoryItem?: Maybe<IInventoryItemModel>;
  inventoryItems: IPaginatedInventoryItem;
  notification?: Maybe<INotificationModel>;
  notifications: IPaginatedNotification;
  order?: Maybe<IOrderModel>;
  orders: IPaginatedOrder;
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
  transporter?: Maybe<ITransporterModel>;
  transporters: IPaginatedTransporter;
  user?: Maybe<IUserModel>;
  userCount: IUserCount;
  userRoles?: Maybe<IPaginatedUserRoles>;
  users: IPaginatedUser;
  vehicle?: Maybe<IVehicleModel>;
  vehicles: IPaginatedVehicle;
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


export type IQueryCartArgs = {
  id: Scalars['UUID']['input'];
};


export type IQueryCartsArgs = {
  query?: InputMaybe<IQueryParams>;
};


export type IQueryCatalogueArgs = {
  id: Scalars['UUID']['input'];
};


export type IQueryCataloguesArgs = {
  query?: InputMaybe<IQueryParams>;
};


export type IQueryDispatchArgs = {
  id: Scalars['UUID']['input'];
};


export type IQueryDispatchesArgs = {
  query?: InputMaybe<IQueryParams>;
};


export type IQueryDriverArgs = {
  id: Scalars['UUID']['input'];
};


export type IQueryDriverInventoriesArgs = {
  query?: InputMaybe<IQueryParams>;
};


export type IQueryDriverInventoryArgs = {
  id: Scalars['UUID']['input'];
};


export type IQueryDriversArgs = {
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


export type IQueryInventoryChangeArgs = {
  id: Scalars['UUID']['input'];
};


export type IQueryInventoryChangesArgs = {
  query?: InputMaybe<IQueryParams>;
};


export type IQueryInventoryItemArgs = {
  id: Scalars['UUID']['input'];
};


export type IQueryInventoryItemsArgs = {
  query?: InputMaybe<IQueryParams>;
};


export type IQueryNotificationArgs = {
  id: Scalars['UUID']['input'];
};


export type IQueryNotificationsArgs = {
  query?: InputMaybe<IQueryParams>;
};


export type IQueryOrderArgs = {
  id: Scalars['UUID']['input'];
};


export type IQueryOrdersArgs = {
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


export type IQueryTransporterArgs = {
  id: Scalars['UUID']['input'];
};


export type IQueryTransportersArgs = {
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


export type IQueryVehicleArgs = {
  id: Scalars['UUID']['input'];
};


export type IQueryVehiclesArgs = {
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

export enum IReferenceType {
  Adjustment = 'ADJUSTMENT',
  Dispatch = 'DISPATCH',
  Manual = 'MANUAL',
  Order = 'ORDER',
  Return = 'RETURN',
  Transfer = 'TRANSFER'
}

export type IRoleModel = {
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  permissions?: Maybe<Array<Maybe<IPermissionModel>>>;
  stationId: Scalars['UUID']['output'];
};

export enum IScanAction {
  DealerFromDriverConfirmed = 'DEALER_FROM_DRIVER_CONFIRMED',
  DealerToDriverConfirmed = 'DEALER_TO_DRIVER_CONFIRMED',
  DepotFromDriverConfirmed = 'DEPOT_FROM_DRIVER_CONFIRMED',
  DepotToDriverConfirmed = 'DEPOT_TO_DRIVER_CONFIRMED',
  DriverFromDealerConfirmed = 'DRIVER_FROM_DEALER_CONFIRMED',
  DriverFromDepotConfirmed = 'DRIVER_FROM_DEPOT_CONFIRMED',
  DriverToDealerConfirmed = 'DRIVER_TO_DEALER_CONFIRMED',
  DriverToDepotConfirmed = 'DRIVER_TO_DEPOT_CONFIRMED'
}

export enum IScanConfirmDriverInventoryStatus {
  DealerFromDriverConfirmed = 'DEALER_FROM_DRIVER_CONFIRMED',
  DriverToDealerConfirmed = 'DRIVER_TO_DEALER_CONFIRMED'
}

export type IScanConfirmInput = {
  depotId?: InputMaybe<ISelectCategory>;
  dispatchId: Scalars['UUID']['input'];
  emptyCylinders?: InputMaybe<IEmptyCylindersScanConfirmInput>;
  inventoryItems?: InputMaybe<Array<InputMaybe<ISelectCategory>>>;
  scanAction: IScanAction;
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
  brands?: Maybe<Array<IBrandModel>>;
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

export type ITransporterDriverInput = {
  email: Scalars['EmailAddress']['input'];
  id: Scalars['UUID']['input'];
  licenseNumber: Scalars['String']['input'];
  name: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  vehicles?: InputMaybe<Array<InputMaybe<Scalars['UUID']['input']>>>;
};

export type ITransporterModel = {
  contactPerson: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  drivers?: Maybe<Array<Maybe<IDriverModel>>>;
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  vehicles?: Maybe<Array<Maybe<IVehicleModel>>>;
};

export type ITransporterVehicleInput = {
  capacity: Scalars['PositiveFloat']['input'];
  id: Scalars['UUID']['input'];
  registrationNumber: Scalars['String']['input'];
  type: Scalars['String']['input'];
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

export type IUpdateCartInput = {
  id: Scalars['UUID']['input'];
  items: Array<InputMaybe<ICartCatalogueInput>>;
};

export type IUpdateCatalogueInput = {
  brandId: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  pricePerUnit?: InputMaybe<Scalars['Float']['input']>;
  quantityPerUnit: Scalars['Float']['input'];
  unit: ICatalogueUnit;
};

export type IUpdateDispatchInput = {
  dispatchDate?: InputMaybe<Scalars['DateTime']['input']>;
  status?: InputMaybe<IDispatchStatus>;
};

export type IUpdateDriverInput = {
  licenseNumber?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type IUpdateDriverInventoryInput = {
  returnedAt?: InputMaybe<Scalars['DateTime']['input']>;
  status?: InputMaybe<IDriverInventoryStatus>;
};

export type IUpdateInventoryChangeInput = {
  inventoryId: Scalars['UUID']['input'];
  quantity: Scalars['PositiveFloat']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
  referenceType?: InputMaybe<IReferenceType>;
  type?: InputMaybe<IInventoryChangeType>;
};

export type IUpdateInventoryInput = {
  catalogueId: Scalars['String']['input'];
  quantity: Scalars['Float']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
  stationId: Scalars['String']['input'];
};

export type IUpdateInventoryItemInput = {
  batchNumber: Scalars['String']['input'];
  expiryDate?: InputMaybe<Scalars['DateTime']['input']>;
  inventoryId: Scalars['UUID']['input'];
  manufactureDate?: InputMaybe<Scalars['DateTime']['input']>;
  serialNumber?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<IInventoryItemStatus>;
};

export type IUpdateInventoryItemStatusInput = {
  itemId: Scalars['UUID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
  status: IInventoryItemStatus;
};

export type IUpdateNotificationInput = {
  description: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type IUpdateOrderInput = {
  status: IOrderStatus;
};

export type IUpdateOrderResponse = {
  data: IOrderModel;
  message: Scalars['String']['output'];
};

export type IUpdateOrderStatusInput = {
  status: IOrderStatus;
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
  permissions: Array<InputMaybe<ISelectCategory>>;
};

export type IUpdateSettingInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type IUpdateStationInput = {
  brands?: InputMaybe<Array<ISelectCategory>>;
  name: Scalars['String']['input'];
  type?: InputMaybe<IStationType>;
};

export type IUpdateTransporterInput = {
  contactPerson: Scalars['String']['input'];
  drivers?: InputMaybe<Array<InputMaybe<ITransporterDriverInput>>>;
  name: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  vehicles?: InputMaybe<Array<InputMaybe<ITransporterVehicleInput>>>;
};

export type IUpdateUserInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  middleName?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  roles?: InputMaybe<Array<InputMaybe<IUserRoleInput>>>;
};

export type IUpdateVehicleInput = {
  capacity?: InputMaybe<Scalars['Float']['input']>;
  registrationNumber?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
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
  roles?: Maybe<Array<Maybe<IUserRole>>>;
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type IUserRole = {
  driver?: Maybe<IDriverModel>;
  id: Scalars['UUID']['output'];
  role?: Maybe<IRoleModel>;
  roleId: Scalars['UUID']['output'];
  station?: Maybe<IStationModel>;
  stationId: Scalars['UUID']['output'];
  userId: Scalars['UUID']['output'];
};

export type IUserRoleInput = {
  id: Scalars['String']['input'];
  roleId: Scalars['UUID']['input'];
  stationId: Scalars['UUID']['input'];
};

export type IValidatePasswordResetTokenResponse = {
  user?: Maybe<IUserModel>;
};

export type IVehicleModel = {
  capacity: Scalars['Float']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['UUID']['output'];
  registrationNumber: Scalars['String']['output'];
  transporter: ITransporterModel;
  transporterId: Scalars['UUID']['output'];
  type: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};
