import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OrderModel } from '@lpg-manager/db';
import { CrudAbstractService } from '@lpg-manager/crud-abstract';

@Injectable()
export class OrderService extends CrudAbstractService<OrderModel> {
  constructor(
    @InjectModel(OrderModel) private orderModel: typeof OrderModel,
  ) {
    super(orderModel);
  }

  async createOrder(cartId: string, stationId: string, totalPrice: number) {
    return this.orderModel.create({ cartId, stationId, totalPrice });
  }
}
