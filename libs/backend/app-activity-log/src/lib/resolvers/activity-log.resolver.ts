import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ActivityLogBackendService } from '@lpg-manager/activity-log-service';
import { CreateActivityLogInputDto } from '../dto/create-activity-log-input.dto';
import {
  BadRequestException,
  Body,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ActivityLogCreatedEvent } from '../events/activity-log-created.event';
import { JwtAuthGuard } from '@lpg-manager/auth';
import {
  PermissionGuard,
  Permissions,
  PermissionsEnum,
} from '@lpg-manager/permission-service';
import { ActivityLogModel, IQueryParam } from '@lpg-manager/db';
import { UpdateActivityLogInputDto } from '../dto/update-activity-log-input.dto';
import { ActivityLogUpdatedEvent } from '../events/activity-log-updated.event';
import { DeleteActivityLogInputDto } from '../dto/delete-activity-log-input.dto';
import { ActivityLogDeletedEvent } from '../events/activity-log-deleted.event';

@Resolver(() => ActivityLogModel)
export class ActivityLogResolver {
  constructor(
    private activityLogService: ActivityLogBackendService,
    private eventEmitter: EventEmitter2
  ) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => ActivityLogModel)
  activityLogs(@Args('query') query: IQueryParam) {
    return this.activityLogService.findAll({
      ...query,
      filters: query?.filters ?? [],
    });
  }

  @Query(() => ActivityLogModel)
  async activityLog(@Args('id') id: string) {
    return this.activityLogService.findById(id);
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.CreateActivityLog)
  async createActivityLog(
    @Body('params', new ValidationPipe()) params: CreateActivityLogInputDto
  ) {
    const activityLog = await this.activityLogService.create({
      ...params,
    });

    this.eventEmitter.emit(
      'activity-log.created',
      new ActivityLogCreatedEvent(activityLog)
    );

    return {
      message: 'Successfully created activity-log',
      data: activityLog,
    };
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.UpdateActivityLog)
  async updateActivityLog(
    @Body(new ValidationPipe()) params: UpdateActivityLogInputDto
  ) {
    const activityLog = await this.activityLogService.findById(params.id);
    if (activityLog) {
      await activityLog?.update(params.params);
      await activityLog?.save();

      this.eventEmitter.emit(
        'activityLog.updated',
        new ActivityLogUpdatedEvent(activityLog)
      );
      return {
        message: 'Successfully created activityLog',
        data: activityLog,
      };
    }
    throw new BadRequestException('No activity-log found');
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.DeleteActivityLog)
  async deleteActivityLog(
    @Body(new ValidationPipe()) { id }: DeleteActivityLogInputDto
  ) {
    const activityLog = (await this.activityLogService.findById(
      id
    )) as ActivityLogModel;

    await activityLog.destroy();
    this.eventEmitter.emit(
      'activity-log.deleted',
      new ActivityLogDeletedEvent(activityLog)
    );

    return {
      message: 'Successfully deleted activity-log',
      data: activityLog,
    };
  }
}
