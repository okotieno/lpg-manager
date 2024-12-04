import { IsInt } from 'class-validator';
import { UserModel } from '@lpg-manager/db';
import { Exists } from '@lpg-manager/validators';

export class DeleteUserInputDto {
  @IsInt()
  @Exists(UserModel, 'id', {
    message: (validationArguments) =>
      `User with id  ${validationArguments.value}" not found`,
  })
  id = 0;
}
