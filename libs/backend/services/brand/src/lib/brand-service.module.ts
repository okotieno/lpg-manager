import { Module } from '@nestjs/common';
import { BrandService } from './services/brand.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { BrandModel } from '@lpg-manager/db';

@Module({
  imports: [SequelizeModule.forFeature([BrandModel])],
  providers: [BrandService],
  exports: [BrandService],
})
export class BrandServiceModule {}
