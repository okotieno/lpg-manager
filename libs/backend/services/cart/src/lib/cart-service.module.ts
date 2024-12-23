import { Module } from '@nestjs/common';
import { CartService } from './services/cart.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { CartModel } from '@lpg-manager/db';

@Module({
  imports: [
    SequelizeModule.forFeature([CartModel])
  ],
  providers: [
    CartService
  ],
  exports: [
    CartService
  ],
})
export class CartServiceModule {}
