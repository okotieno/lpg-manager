import { IsArray, IsDate, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Exists } from '@lpg-manager/validators';
import { TransporterModel, DriverModel, VehicleModel, OrderModel } from '@lpg-manager/db';

export class CreateDispatchInputDto {
  @IsUUID()
  @IsNotEmpty()
  @Exists(TransporterModel, 'id', {
    message: (validationArguments) =>
      `Transporter with id ${validationArguments.value} not found`,
  })
  transporterId!: string;

  @IsUUID()
  @IsNotEmpty()
  @Exists(DriverModel, 'id', {
    message: (validationArguments) =>
      `Driver with id ${validationArguments.value} not found`,
  })
  driverId!: string;

  @IsUUID()
  @IsNotEmpty()
  @Exists(VehicleModel, 'id', {
    message: (validationArguments) =>
      `Vehicle with id ${validationArguments.value} not found`,
  })
  vehicleId!: string;

  @IsDate()
  @Type(() => Date)
  dispatchDate!: Date;

  @IsArray()
  // @IsUUID('4', { each: true })
  // @ValidateNested({ each: true })
  // @Exists(OrderModel, 'id', {
  //   message: (validationArguments) =>
  //     `Order with id ${validationArguments.value} not found`,
  // })
  orderIds!: string[];
}
