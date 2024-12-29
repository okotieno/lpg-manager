import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemInput {
  @IsString()
  catalogueId!: string;

  @IsString()
  inventoryId!: string;

  @IsNumber()
  quantity!: number;

  @IsNumber()
  pricePerUnit!: number;
}

export class CreateOrderInputDto {
  @IsString()
  cartId!: string;

  @IsString()
  stationId!: string;

  @IsNumber()
  totalPrice!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemInput)
  items!: OrderItemInput[];
}
