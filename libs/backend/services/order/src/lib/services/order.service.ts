import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  CartModel,
  CatalogueModel,
  OrderItemModel,
  OrderModel,
  StationModel,
} from '@lpg-manager/db';
import { CrudAbstractService } from '@lpg-manager/crud-abstract';
import { Transaction } from 'sequelize';

@Injectable()
export class OrderService extends CrudAbstractService<OrderModel> {
  constructor(
    @InjectModel(OrderModel) private orderModel: typeof OrderModel,
    @InjectModel(OrderItemModel) private orderItemModel: typeof OrderItemModel,
    @InjectModel(CartModel) private cartModel: typeof CartModel
  ) {
    super(orderModel);
  }

  async createOrder(
    cartId: string,
    depotId: string,
    totalPrice: number,
    items: Array<{
      catalogueId: string;
      inventoryId: string;
      quantity: number;
      pricePerUnit: number;
    }>
  ) {
    return this.orderModel.sequelize?.transaction(
      async (transaction: Transaction) => {
        const cart = await this.cartModel.findByPk(cartId);
        if (!cart) {
          throw new Error('Cart not found');
        }

        const order = await this.orderModel.create(
          {
            cartId,
            depotId,
            dealerId: cart.dealerId,
            totalPrice,
          },
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
      }
    );
  }

  async updateOrderStatus(orderId: string, status: string) {
    const transaction = await this.orderModel.sequelize?.transaction();
    try {
      const order = await this.orderModel.findByPk(orderId);

      if (!order) {
        throw new NotFoundException(`Order with ID "${orderId}" not found`);
      }

      if (order.status === 'COMPLETED' || order.status === 'CANCELLED') {
        throw new BadRequestException(
          'Cannot update status of a completed or canceled order'
        );
      }

      await order.update({ status }, { transaction });

      await transaction?.commit();

      const updatedOrder = await this.findById(orderId, {
        include: [
          {
            model: OrderItemModel,
            include: [CatalogueModel],
          },
          {
            model: StationModel,
            as: 'dealer',
          },
          {
            model: StationModel,
            as: 'depot',
          },
        ],
      });

      return updatedOrder;
    } catch (error) {
      await transaction?.rollback();
      throw error;
    }
  }
}
