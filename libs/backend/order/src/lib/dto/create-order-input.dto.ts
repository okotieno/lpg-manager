import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class OrderCatalogueInput {
  @IsString()
  catalogueId!: string;

  @IsNumber()
  quantity!: number;
}

export class CreateOrderInputDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderCatalogueInput)
  items!: OrderCatalogueInput[];
}
