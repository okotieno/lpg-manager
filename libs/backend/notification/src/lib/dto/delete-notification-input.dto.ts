import { IsInt } from 'class-validator';
import { NotificationModel } from '@lpg-manager/db';
import { Exists } from '@lpg-manager/validators';


export class DeleteNotificationInputDto {
  @IsInt()
  @Exists(NotificationModel, 'id', {
    message: (validationArguments) =>
      `Notification with id  ${validationArguments.value}" not found`,
  })
  id!: string;
}
