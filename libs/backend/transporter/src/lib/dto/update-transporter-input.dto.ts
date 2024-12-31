import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { TransporterModel } from '@lpg-manager/db';
import { Exists } from '@lpg-manager/validators';
import { CreateTransporterInputDto } from './create-transporter-input.dto';

export class UpdateTransporterInputDto {
  @IsString()
  @IsNotEmpty()
  @Exists(TransporterModel, 'id', {
    message: (validationArguments) =>
      `Transporter with id ${validationArguments.value} not found`
  })
  id!: string;

  @ValidateNested()
  params!: CreateTransporterInputDto;
} 