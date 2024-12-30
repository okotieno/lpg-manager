import { IsEnum, IsNotEmpty } from 'class-validator';

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED'
}

export class UpdateOrderStatusInput {
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  status!: OrderStatus;
}