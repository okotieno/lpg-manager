import { IsNotEmpty } from 'class-validator';
import { IsPhoneNumberOrEmail } from '@lpg-manager/validators';


export class ValidateOtpInputDto {

  @IsNotEmpty()
  @IsPhoneNumberOrEmail({ message: 'Identifier must be a valid email or phone number' })
  identifier = '';

  @IsNotEmpty()
  token = '';
}
