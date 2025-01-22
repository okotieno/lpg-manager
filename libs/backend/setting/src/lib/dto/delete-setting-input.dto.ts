import { IsInt } from 'class-validator';
import { SettingModel } from '@lpg-manager/db';
import { Exists } from '@lpg-manager/validators';

export class DeleteSettingInputDto {
  @IsInt()
  @Exists(SettingModel, 'id', {
    message: (validationArguments) =>
      `Setting with id  ${validationArguments.value}" not found`,
  })
  id = '';
}
