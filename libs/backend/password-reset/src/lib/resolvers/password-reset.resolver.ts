import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PasswordResetBackendService } from '@lpg-manager/password-reset-backend-service';
import { CreatePasswordResetInputDto } from '../dto/create-password-reset-input.dto';
import {
  BadRequestException,
  Body,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PasswordResetCreatedEvent } from '../events/password-reset-created.event';
import { JwtAuthGuard } from '@lpg-manager/auth';
import {
  PermissionGuard,
  Permissions,
  PermissionsEnum,
} from '@lpg-manager/permission-service';
import { IQueryParam, PasswordResetModel } from '@lpg-manager/db';
import { UpdatePasswordResetInputDto } from '../dto/update-password-reset-input.dto';
import { PasswordResetUpdatedEvent } from '../events/password-reset-updated.event';
import { DeletePasswordResetInputDto } from '../dto/delete-password-reset-input.dto';
import { PasswordResetDeletedEvent } from '../events/password-reset-deleted.event';

@Resolver()
export class PasswordResetResolver {
  constructor(
    private passwordResetService: PasswordResetBackendService,
    private eventEmitter: EventEmitter2
  ) {}

  @Query(() => PasswordResetModel)
  passwordResets(@Args('query') query: IQueryParam) {
    return this.passwordResetService.findAll({
      ...query,
      filters: query?.filters ?? [],
    });
  }

  @Query(() => PasswordResetModel)
  async passwordReset(@Args('id') id: string) {
    return this.passwordResetService.findById(id);
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.CreatePasswordReset)
  async createPasswordReset(
    @Body(new ValidationPipe()) params: CreatePasswordResetInputDto
  ) {
    const passwordReset = await this.passwordResetService.create({
      ...params,
    });

    this.eventEmitter.emit(
      'password-reset.created',
      new PasswordResetCreatedEvent(passwordReset)
    );

    return {
      message: 'Successfully created password-reset',
      data: passwordReset,
    };
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.UpdatePasswordReset)
  async updatePasswordReset(
    @Body(new ValidationPipe()) params: UpdatePasswordResetInputDto
  ) {
    const passwordReset = await this.passwordResetService.findById(params.id);
    if (passwordReset) {
      await passwordReset?.update(params.params);
      await passwordReset?.save();

      this.eventEmitter.emit(
        'passwordReset.updated',
        new PasswordResetUpdatedEvent(passwordReset)
      );
      return {
        message: 'Successfully created passwordReset',
        data: passwordReset,
      };
    }
    throw new BadRequestException('No password-reset found');
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.DeletePasswordReset)
  async deletePasswordReset(
    @Body(new ValidationPipe()) { id }: DeletePasswordResetInputDto
  ) {
    const passwordReset = (await this.passwordResetService.findById(
      id
    )) as PasswordResetModel;

    await passwordReset.destroy();
    this.eventEmitter.emit(
      'password-reset.deleted',
      new PasswordResetDeletedEvent(passwordReset)
    );

    return {
      message: 'Successfully deleted password-reset',
      data: passwordReset,
    };
  }
}
