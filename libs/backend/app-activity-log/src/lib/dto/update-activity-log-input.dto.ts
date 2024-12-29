import { IsInt, ValidateNested } from 'class-validator';
import { CreateActivityLogInputDto } from './create-activity-log-input.dto';
import { ActivityLogModel } from '@lpg-manager/db';
import { Exists } from '@lpg-manager/validators';

export class UpdateActivityLogInputDto {
  @IsInt()
  @Exists(ActivityLogModel, 'id', {
    message: (validationArguments) =>
      `ActivityLog with id  ${validationArguments.value}" not found`,
  })
  id!: string;

  @ValidateNested()
  params: CreateActivityLogInputDto = { name: '' };
}
