import { IsEnum, IsNotEmpty } from 'class-validator';

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
  DELIVERING = 'DELIVERING',
  RETURNED = 'RETURNED',
}

export class UpdateOrderStatusInput {
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  status!: OrderStatus;
}
