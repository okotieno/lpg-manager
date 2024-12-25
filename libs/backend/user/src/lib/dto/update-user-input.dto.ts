import { IsInt, ValidateNested } from 'class-validator';
import { CreateUserInputDto } from './create-user-input.dto';
import { UserModel } from '@lpg-manager/db';
import { Exists } from '@lpg-manager/validators';

export class UpdateUserInputDto {
  @IsInt()
  @Exists(UserModel, 'id', {
    message: (validationArguments) =>
      `User with id  ${validationArguments.value}" not found`,
  })
  id = '';

  @ValidateNested()
  params!: CreateUserInputDto;
}
