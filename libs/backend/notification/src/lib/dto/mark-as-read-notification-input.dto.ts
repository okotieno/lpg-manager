import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { NotificationModel } from '@lpg-manager/db';
import { Exists } from '@lpg-manager/validators';

class NotificationSelectedInputDto {
  @Exists(NotificationModel, 'id', {
    message: (validationArguments) =>
      `Notification with id  ${validationArguments.value}" not found`,
  })
  id!: string;
}

export class MarkAsReadNotificationInputDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NotificationSelectedInputDto)
  notifications: NotificationSelectedInputDto[] = [];
}