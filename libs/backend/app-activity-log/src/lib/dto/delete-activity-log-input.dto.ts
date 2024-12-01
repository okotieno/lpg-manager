import { IsInt } from 'class-validator';
import { ActivityLogModel } from '@lpg-manager/db';
import { Exists } from '@lpg-manager/validators';

export class DeleteActivityLogInputDto {
  @IsInt()
  @Exists(ActivityLogModel, 'id', {
    message: (validationArguments) =>
      `ActivityLog with id  ${validationArguments.value}" not found`,
  })
  id = 0;
}
