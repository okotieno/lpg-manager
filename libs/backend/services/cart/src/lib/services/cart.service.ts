import { Injectable } from '@nestjs/common';
import { CrudAbstractService } from '@lpg-manager/crud-abstract';
import { CartModel, CartCatalogueModel, CatalogueModel, CartStatus } from '@lpg-manager/db';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';

@Injectable()
export class CartService extends CrudAbstractService<CartModel> {
  constructor(
    @InjectModel(CartModel) cartModel: typeof CartModel,
    @InjectModel(CartCatalogueModel) private cartCatalogueModel: typeof CartCatalogueModel,
  ) {
    super(cartModel);
  }

  override async create(data: Partial<CartModel>) {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Set expiry to 24 hours from now

    return super.create({
      ...data,
      expiresAt,
      status: CartStatus.PENDING
    });
  }

  async addItem(cartId: string, catalogueId: string, quantity: number) {
    const transaction = await this.model.sequelize?.transaction();
    try {
      await this.cartCatalogueModel.create({
        cartId,
        catalogueId,
        quantity
      }, { transaction });

      await this.updateCartTotals(cartId, transaction);
      await transaction?.commit();

      return this.findById(cartId, {
        include: [{
          model: CartCatalogueModel,
          include: [CatalogueModel]
        }]
      });
    } catch (error) {
      await transaction?.rollback();
      throw error;
    }
  }

  async removeItem(cartId: string, cartCatalogueId: string) {
    const transaction = await this.model.sequelize?.transaction();
    try {
      await this.cartCatalogueModel.destroy({
        where: {
          id: cartCatalogueId,
          cartId
        },
        transaction
      });

      await this.updateCartTotals(cartId, transaction);
      await transaction?.commit();

      return this.findById(cartId, {
        include: [{
          model: CartCatalogueModel,
          include: [CatalogueModel]
        }]
      });
    } catch (error) {
      await transaction?.rollback();
      throw error;
    }
  }

  async updateItemQuantity(cartId: string, cartCatalogueId: string, quantity: number) {
    const transaction = await this.model.sequelize?.transaction();
    try {
      await this.cartCatalogueModel.update(
        { quantity },
        {
          where: {
            id: cartCatalogueId,
            cartId
          },
          transaction
        }
      );

      await this.updateCartTotals(cartId, transaction);
      await transaction?.commit();

      return this.findById(cartId, {
        include: [{
          model: CartCatalogueModel,
          include: [CatalogueModel]
        }]
      });
    } catch (error) {
      await transaction?.rollback();
      throw error;
    }
  }

  async addItems(cartId: string, items: Array<{ catalogueId: string; quantity: number }>, transaction?: Transaction) {
    const cartItems = items.map(item => ({
      cartId,
      catalogueId: item.catalogueId,
      quantity: item.quantity
    }));

    await this.cartCatalogueModel.bulkCreate(cartItems, { transaction });
  }

  async updateCartTotals(cartId: string, transaction?: Transaction) {
    const cartItems = await this.cartCatalogueModel.findAll({
      where: { cartId },
      include: [CatalogueModel],
      transaction
    });

    const totalQuantity = cartItems.reduce((sum, item) => sum + Number(item.quantity), 0);
    const totalPrice = cartItems.reduce((sum, item) => {
      const pricePerUnit = Number(item.catalogue.pricePerUnit) || 0;
      return sum + (pricePerUnit * Number(item.quantity));
    }, 0);

    await this.model.update(
      { totalQuantity, totalPrice },
      { where: { id: cartId }, transaction }
    );
  }

  async completeCart(cartId: string) {
    const transaction = await this.model.sequelize?.transaction();
    try {
      await this.model.update(
        {
          status: 'COMPLETED',
        },
        {
          where: { id: cartId },
          transaction
        }
      );

      await transaction?.commit();

      return this.findById(cartId, {
        include: [{
          model: CartCatalogueModel,
          include: [CatalogueModel]
        }]
      });
    } catch (error) {
      await transaction?.rollback();
      throw error;
    }
  }

}
