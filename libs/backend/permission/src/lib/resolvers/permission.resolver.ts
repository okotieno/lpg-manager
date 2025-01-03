import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreatePermissionInputDto } from '../dto/create-permission-input.dto';
import { Body, UseGuards, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '@lpg-manager/auth';
import {
  PermissionGuard,
  Permissions,
  PermissionsEnum,
  PermissionService,
} from '@lpg-manager/permission-service';
import { IQueryParam, PermissionModel } from '@lpg-manager/db';

@Resolver()
export class PermissionResolver {
  constructor(private permissionService: PermissionService) {}

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.CreatePermission)
  async createPermission(
    @Body(new ValidationPipe()) params: CreatePermissionInputDto
  ) {
    const permission = await this.permissionService.create({
      ...params,
    });
    return {
      message: 'Successfully created permission',
      data: permission,
    };
  }

  @Query(() => PermissionModel)
  permissions(@Args('query') query: IQueryParam) {
    return this.permissionService.findAll({
      ...query,
      filters: query?.filters ?? [],
    });
  }

  @Query(() => PermissionModel)
  async permission(@Args('id') id: string) {
    return this.permissionService.findById(id);
  }
}
