import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SettingBackendService } from '@lpg-manager/setting-backend-service';
import { CreateSettingInputDto } from '../dto/create-setting-input.dto';
import {
  BadRequestException,
  Body,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SettingCreatedEvent } from '../events/setting-created.event';
import { JwtAuthGuard } from '@lpg-manager/auth';
import {
  PermissionGuard,
  Permissions,
  PermissionsEnum,
} from '@lpg-manager/permission-service';
import { IQueryParam, SettingModel } from '@lpg-manager/db';
import { UpdateSettingInputDto } from '../dto/update-setting-input.dto';
import { SettingUpdatedEvent } from '../events/setting-updated.event';
import { DeleteSettingInputDto } from '../dto/delete-setting-input.dto';
import { SettingDeletedEvent } from '../events/setting-deleted.event';

@Resolver(() => SettingModel)
export class SettingResolver {
  constructor(
    private settingService: SettingBackendService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Query(() => SettingModel)
  settings(@Args('query') query: IQueryParam) {
    return this.settingService.findAll({
      ...query,
      filters: query?.filters ?? [],
    });
  }

  @Query(() => SettingModel)
  async setting(@Args('id') id: number) {
    return this.settingService.findById(id);
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.CreateSetting)
  async createSetting(
    @Body('params', new ValidationPipe()) params: CreateSettingInputDto,
  ) {
    const setting = await this.settingService.create({
      ...params,
    });

    this.eventEmitter.emit('setting.created', new SettingCreatedEvent(setting));

    return {
      message: 'Successfully created setting',
      data: setting,
    };
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.UpdateSetting)
  async updateSetting(
    @Body(new ValidationPipe()) params: UpdateSettingInputDto,
  ) {
    const setting = await this.settingService.findById(params.id);
    if (setting) {
      await setting?.update(params.params);
      await setting?.save();

      this.eventEmitter.emit(
        'setting.updated',
        new SettingUpdatedEvent(setting),
      );
      return {
        message: 'Successfully created setting',
        data: setting,
      };
    }
    throw new BadRequestException('No setting found');
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.DeleteSetting)
  async deleteSetting(
    @Body(new ValidationPipe()) { id }: DeleteSettingInputDto,
  ) {
    const setting = (await this.settingService.findById(id)) as SettingModel;

    await setting.destroy();
    this.eventEmitter.emit('setting.deleted', new SettingDeletedEvent(setting));

    return {
      message: 'Successfully deleted setting',
      data: setting,
    };
  }
}
