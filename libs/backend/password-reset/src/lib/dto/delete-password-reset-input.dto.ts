import { IsInt } from 'class-validator';
import { PasswordResetModel } from '@lpg-manager/db';
import { Exists } from '@lpg-manager/validators';

export class DeletePasswordResetInputDto {
  @IsInt()
  @Exists(PasswordResetModel, 'id', {
    message: (validationArguments) =>
      `PasswordReset with id  ${validationArguments.value}" not found`,
  })
  id = 0;
}
