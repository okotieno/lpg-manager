import { Module } from '@nestjs/common';
import { CartService } from './services/cart.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { CartCatalogueModel, CartModel, InventoryModel } from '@lpg-manager/db';

@Module({
  imports: [
    SequelizeModule.forFeature([CartModel, CartCatalogueModel, InventoryModel]),
  ],
  providers: [CartService],
  exports: [CartService],
})
export class CartServiceModule {}
