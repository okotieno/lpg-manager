import { IsInt, ValidateNested } from 'class-validator';
import { CreateNotificationInputDto } from './create-notification-input.dto';
import { NotificationModel } from '@lpg-manager/db';
import { Exists } from '@lpg-manager/validators';

export class UpdateNotificationInputDto {
  @IsInt()
  @Exists(NotificationModel, 'id', {
    message: (validationArguments) =>
      `Notification with id  ${validationArguments.value}" not found`,
  })
  id!: string;

  @ValidateNested()
  params: CreateNotificationInputDto = { description: '', title: '' };
}
