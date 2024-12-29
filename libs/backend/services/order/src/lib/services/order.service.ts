import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OrderModel, OrderItemModel } from '@lpg-manager/db';
import { CrudAbstractService } from '@lpg-manager/crud-abstract';
import { Transaction } from 'sequelize';

@Injectable()
export class OrderService extends CrudAbstractService<OrderModel> {
  constructor(
    @InjectModel(OrderModel) private orderModel: typeof OrderModel,
    @InjectModel(OrderItemModel) private orderItemModel: typeof OrderItemModel,
  ) {
    super(orderModel);
  }

  async createOrder(
    cartId: string,
    stationId: string,
    totalPrice: number,
    items: Array<{
      catalogueId: string;
      inventoryId: string;
      quantity: number;
      pricePerUnit: number;
    }>,
  ) {
    return this.orderModel.sequelize?.transaction(async (transaction: Transaction) => {
      const order = await this.orderModel.create(
        { cartId, stationId, totalPrice },
        { transaction }
      );

      await Promise.all(
        items.map((item) =>
          this.orderItemModel.create(
            {
              orderId: order.id,
              ...item,
            },
            { transaction }
          )
        )
      );

      return order;
    });
  }
}
