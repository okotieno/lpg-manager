import { IsInt, ValidateNested } from 'class-validator';
import { CreatePasswordResetInputDto } from './create-password-reset-input.dto';
import { PasswordResetModel } from '@lpg-manager/db';
import { Exists } from '@lpg-manager/validators';

export class UpdatePasswordResetInputDto {
  @IsInt()
  @Exists(PasswordResetModel, 'id', {
    message: (validationArguments) =>
      `PasswordReset with id  ${validationArguments.value}" not found`,
  })
  id = 0;

  @ValidateNested()
  params: CreatePasswordResetInputDto = { name: '' };
}
