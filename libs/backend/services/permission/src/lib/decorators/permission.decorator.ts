import { SetMetadata } from '@nestjs/common';
// import { PermissionsEnum } from '../enums/permission.enum';
import { IPermissionEnum } from '@lpg-manager/types';

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: IPermissionEnum[]) => SetMetadata(PERMISSIONS_KEY, permissions);
