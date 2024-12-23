import { Injectable } from '@nestjs/common';
import { CrudAbstractService } from '@lpg-manager/crud-abstract';
import { CartModel } from '@lpg-manager/db';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class CartService extends CrudAbstractService<CartModel> {
  constructor(
    @InjectModel(CartModel) cartModel: typeof CartModel,
  ) {
    super(cartModel);
  }
}
