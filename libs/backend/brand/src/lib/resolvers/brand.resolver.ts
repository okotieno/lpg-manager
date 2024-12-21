import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateBrandInputDto } from '../dto/create-brand-input.dto';
import { Body, UseGuards, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '@lpg-manager/auth';
import { PermissionGuard, Permissions, PermissionsEnum } from '@lpg-manager/permission-service';
import { BrandService } from '@lpg-manager/brand-service';
import { IQueryParam, BrandModel } from '@lpg-manager/db';
import { CatalogueService } from '@lpg-manager/catalogue-service';

@Resolver(() => BrandModel)
export class BrandResolver {

  constructor(private brandService: BrandService,  private catalogueService: CatalogueService) {
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

    // Handle catalogue creation
    if (params.catalogues?.length) {
      const cataloguePromises = params.catalogues.map(catalogue =>
        this.catalogueService.create({
          ...catalogue,
          brandId: brand.id
        })
      );
      await Promise.all(cataloguePromises);
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
