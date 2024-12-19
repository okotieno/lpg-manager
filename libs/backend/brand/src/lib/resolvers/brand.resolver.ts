import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateBrandInputDto } from '../dto/create-brand-input.dto';
import { Body, UseGuards, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '@lpg-manager/auth';
import { PermissionGuard, Permissions, PermissionsEnum } from '@lpg-manager/permission-service';
import { BrandService } from '@lpg-manager/brand-service';
import { IQueryParam, BrandModel } from '@lpg-manager/db';

@Resolver(() => BrandModel)
export class BrandResolver {

  constructor(private brandService: BrandService) {
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.CreateBrand)
  async createBrand(@Body('params', new ValidationPipe()) params: CreateBrandInputDto) {
    const brand = await this.brandService.create({
      name: params.name,
      companyName: params.companyName,
    });

    if (params.images?.length) {
      await brand.$set('images', params.images.map(img => img.id));
    }

    return {
      message: 'Brand created successfully',
      data: brand
    };
  }

  @Query(() => BrandModel)
  brands(
    @Args('query') query: IQueryParam
  ) {
    return this.brandService.findAll({
      ...query,
      filters: query?.filters ?? []
    });
  }

  @Query(() => BrandModel)
  async brand(
    @Args('id') id: string
  ) {
    return this.brandService.findById(id);
  }

  @Mutation(() => BrandModel)
  async deleteBrand(
    @Args('id') id: string
  ) {
    await this.brandService.deleteById(id);

    return {
      message: 'Successfully deleted brand'
    };
  }
}
