import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { StationModel } from '@lpg-manager/db';
import { Exists } from '@lpg-manager/validators';
import { CreateStationInputDto } from './create-station-input.dto';

export class UpdateStationInputDto {
  @IsString()
  @IsNotEmpty()
  @Exists(StationModel, 'id', {
    message: (validationArguments) =>
      `Station with id ${validationArguments.value} not found`
  })
  id!: string;

  @ValidateNested()
  params!: CreateStationInputDto;
}
