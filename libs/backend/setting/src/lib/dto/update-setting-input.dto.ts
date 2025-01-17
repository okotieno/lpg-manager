import { IsInt, ValidateNested } from 'class-validator';
import { CreateSettingInputDto } from './create-setting-input.dto';
import { SettingModel } from '@lpg-manager/db';
import { Exists } from '@lpg-manager/validators';

export class UpdateSettingInputDto {
  @IsInt()
  @Exists(SettingModel, 'id', {
    message: (validationArguments) =>
      `Setting with id  ${validationArguments.value}" not found`,
  })
  id = '';

  @ValidateNested()
  params: CreateSettingInputDto = { name: '' };
}
