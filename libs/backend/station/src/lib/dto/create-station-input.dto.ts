import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

enum StationType {
  'DEPOT' = 'DEPOT',
  'DEALER' = 'DEALER',
}

export class CreateStationInputDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEnum(StationType)
  @IsNotEmpty()
  type!: 'DEPOT' | 'DEALER';
}
