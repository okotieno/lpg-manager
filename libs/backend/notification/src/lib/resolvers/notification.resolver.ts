import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { CreateNotificationInputDto } from '../dto/create-notification-input.dto';
import {
  BadRequestException,
  Body,
  Inject,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationCreatedEvent } from '../events/notification-created.event';

import { UpdateNotificationInputDto } from '../dto/update-notification-input.dto';
import { NotificationUpdatedEvent } from '../events/notification-updated.event';
import { DeleteNotificationInputDto } from '../dto/delete-notification-input.dto';
import { NotificationDeletedEvent } from '../events/notification-deleted.event';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { IQueryParam, NotificationModel, UserModel } from '@lpg-manager/db';
import { NotificationService } from '@lpg-manager/notification-service';
import { PUB_SUB } from '@lpg-manager/util';
import { CurrentUser, JwtAuthGuard } from '@lpg-manager/auth';

import {
  PermissionGuard,
  Permissions,
  PermissionsEnum,
} from '@lpg-manager/permission-service';

@Resolver(() => NotificationModel)
export class NotificationResolver {
  constructor(
    private notificationService: NotificationService,
    private eventEmitter: EventEmitter2,
    @Inject(PUB_SUB) private pubSub: RedisPubSub,
  ) {}

  @Query(() => NotificationModel)
  notifications(@Args('query') query: IQueryParam) {
    return this.notificationService.findAll({
      ...query,
      filters: query?.filters ?? [],
    });
  }

  @Query(() => NotificationModel)
  async notification(@Args('id') id: string) {
    return this.notificationService.findById(id);
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.CreateNotification)
  async createNotification(
    @Body('params', new ValidationPipe()) params: CreateNotificationInputDto,
  ) {
    const notification = await this.notificationService.create({
      ...params,
    });

    this.eventEmitter.emit(
      'notification.created',
      new NotificationCreatedEvent(notification),
    );

    return {
      message: 'Successfully created notification',
      data: notification,
    };
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.UpdateNotification)
  async updateNotification(
    @Body(new ValidationPipe()) params: UpdateNotificationInputDto,
  ) {
    const notification = await this.notificationService.findById(params.id);
    if (notification) {
      await notification?.update(params.params);
      await notification?.save();

      this.eventEmitter.emit(
        'notification.updated',
        new NotificationUpdatedEvent(notification),
      );
      return {
        message: 'Successfully created notification',
      };
    }
    throw new BadRequestException('No notification found');
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.DeleteNotification)
  async deleteNotification(
    @Body(new ValidationPipe()) { id }: DeleteNotificationInputDto,
  ) {
    const notification = (await this.notificationService.findById(
      id,
    )) as NotificationModel;

    await notification.destroy();
    this.eventEmitter.emit(
      'notification.deleted',
      new NotificationDeletedEvent(notification),
    );

    return {
      message: 'Successfully deleted notification',
      data: notification,
    };
  }

  @Mutation()
  @UseGuards(JwtAuthGuard)
  async testNotification(@CurrentUser() user: UserModel) {
    await this.notificationService.sendNotification(
      `Title ${Math.random()}`,
      `Description ${Math.random()}`,
      [user.id],
    );
    return `Works ${Math.random()}`;
  }

  @Subscription('notificationCreated', {
    async resolve(this: NotificationResolver, value, args, context) {
      const userId = context.extra?.user?.id ?? context.user.id;
      const stats = await this.notificationService.userStats(userId);
      return {
        stats,
        notification: { ...value, isRead: false },
      };
    },
    filter(this: NotificationResolver, payload, variables, context) {
      const userId = context.extra?.user?.id ?? context.user.id;
      return payload.userIds.includes(userId);
    },
  })
  async notificationCreated() {
    return this.pubSub.asyncIterator('notificationCreated');
  }
}
