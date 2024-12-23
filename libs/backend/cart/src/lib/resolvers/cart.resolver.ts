import {
  Args,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Root,
} from '@nestjs/graphql';
import { CreateCartInputDto } from '../dto/create-cart-input.dto';
import { Body, UseGuards, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '@lpg-manager/auth';
import {
  PermissionGuard,
  Permissions,
  PermissionsEnum,
} from '@lpg-manager/permission-service';
import { CartService } from '@lpg-manager/cart-service';
import {
  IQueryParam,
  CartModel,
  BrandModel,
  FileUploadModel,
} from '@lpg-manager/db';
import { BrandService } from '@lpg-manager/brand-service';

@Resolver(() => CartModel)
export class CartResolver {
  constructor(
    private cartService: CartService,
    private brandService: BrandService
  ) {}

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.CreateCart)
  async createCart(
    @Body('params', new ValidationPipe()) params: CreateCartInputDto
  ) {
    const cart = await this.cartService.create({
      name: params.name,
    });

    return {
      message: 'Cart created successfully',
      data: cart,
    };
  }

  @Query(() => CartModel)
  carts(@Args('query') query: IQueryParam) {
    return this.cartService.findAll({
      ...query,
      filters: query?.filters ?? [],
    });
  }

  @Query(() => CartModel)
  async cart(@Args('id') id: string) {
    return this.cartService.findById(id);
  }

  @Mutation(() => CartModel)
  async deleteCart(@Args('id') id: string) {
    await this.cartService.deleteById(id);

    return {
      message: 'Successfully deleted cart',
    };
  }

  @ResolveField('brand', () => BrandModel)
  async getBrand(@Root() cart: CartModel) {
    return this.brandService.findById(cart.brandId);
  }

  @ResolveField('images', () => [FileUploadModel])
  async getImages(
    @Root() cart: CartModel
  ): Promise<FileUploadModel[]> {
    return [];
    // const cartWithImages = await this.cartService.findById(cart.id, {
    //   include: [FileUploadModel]
    // });
    // return cartWithImages?.images || [];
  }
}
