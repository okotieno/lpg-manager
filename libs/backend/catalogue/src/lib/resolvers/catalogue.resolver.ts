import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateCatalogueInputDto } from '../dto/create-catalogue-input.dto';
import { Body, UseGuards, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '@lpg-manager/auth';
import { PermissionGuard, Permissions, PermissionsEnum } from '@lpg-manager/permission-service';
import { CatalogueService } from '@lpg-manager/catalogue-service';
import { IQueryParam, CatalogueModel } from '@lpg-manager/db';

@Resolver(() => CatalogueModel)
export class CatalogueResolver {

  constructor(private catalogueService: CatalogueService) {
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.CreateCatalogue)
  async createCatalogue(@Body('params', new ValidationPipe()) params: CreateCatalogueInputDto) {
    const catalogue = await this.catalogueService.create({
      name: params.name,
    });

    return {
      message: 'Catalogue created successfully',
      data: catalogue
    };
  }

  @Query(() => CatalogueModel)
  catalogues(
    @Args('query') query: IQueryParam
  ) {
    return this.catalogueService.findAll({
      ...query,
      filters: query?.filters ?? []
    });
  }

  @Query(() => CatalogueModel)
  async catalogue(
    @Args('id') id: string
  ) {
    return this.catalogueService.findById(id);
  }

  @Mutation(() => CatalogueModel)
  async deleteCatalogue(
    @Args('id') id: string
  ) {
    await this.catalogueService.deleteById(id);

    return {
      message: 'Successfully deleted catalogue'
    };
  }
}
