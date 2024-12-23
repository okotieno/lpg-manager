import {
  Args,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { Body, UseGuards, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '@lpg-manager/auth';
import {
  PermissionGuard,
  Permissions,
  PermissionsEnum,
} from '@lpg-manager/permission-service';
import { CartService } from '@lpg-manager/cart-service';
import { IQueryParam, CartModel, CartCatalogueModel, CatalogueModel } from '@lpg-manager/db';
import { CreateCartInputDto } from '../dto/create-cart-input.dto';

@Resolver(() => CartModel)
export class CartResolver {
  constructor(
    private cartService: CartService
  ) {}

  @Mutation(() => CartModel)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.CreateCart)
  async createCart(
    @Body('params', new ValidationPipe()) params: CreateCartInputDto
  ) {
    const cart = await this.cartService.create({
      items: params.items,
    });
    if (params.items?.length) {
      await this.cartService.addItems(cart.id, params.items);
    }

    await this.cartService.updateCartTotals(cart.id);

    const cartWithItems = this.cartService.findById(cart.id, {
      include: [{
        model: CartCatalogueModel,
        include: [CatalogueModel]
      }]
    });

    return {
      message: 'Cart created successfully',
      data: cartWithItems,
    };
  }

  @Mutation(() => CartModel)
  async addItemToCart(
    @Args('cartId') cartId: string | undefined,
    @Args('catalogueId') catalogueId: string,
    @Args('quantity') quantity: number
  ) {
    let cart;
    if (!cartId) {
      cart = await this.cartService.create({
        items: [{
          catalogueId,
          quantity
        }]
      });
    } else {
      cart = await this.cartService.addItem(cartId, catalogueId, quantity);
    }

    return {
      message: 'Item added to cart successfully',
      data: cart
    };
  }

  @Mutation(() => CartModel)
  async removeItemFromCart(
    @Args('cartId') cartId: string,
    @Args('cartCatalogueId') cartCatalogueId: string
  ) {
    const cart = await this.cartService.removeItem(cartId, cartCatalogueId);

    return {
      message: 'Item removed from cart successfully',
      data: cart
    };
  }

  @Mutation(() => CartModel)
  async updateItemQuantity(
    @Args('cartId') cartId: string,
    @Args('cartCatalogueId') cartCatalogueId: string,
    @Args('quantity') quantity: number
  ) {
    const cart = await this.cartService.updateItemQuantity(
      cartId,
      cartCatalogueId,
      quantity
    );

    return {
      message: 'Cart item quantity updated successfully',
      data: cart
    };
  }

  @Query(() => CartModel)
  async cart(@Args('id') id: string) {
    return this.cartService.findById(id);
  }

  @Query(() => CartModel)
  carts(@Args('query') query: IQueryParam) {
    return this.cartService.findAll({
      ...query,
      filters: query?.filters ?? [],
    });
  }
}
