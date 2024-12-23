import { Module } from '@nestjs/common';
import { CartService } from './services/cart.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { CartCatalogueModel, CartModel } from '@lpg-manager/db';

@Module({
  imports: [
    SequelizeModule.forFeature([CartModel, CartCatalogueModel])
  ],
  providers: [
    CartService
  ],
  exports: [
    CartService
  ],
})
export class CartServiceModule {}
