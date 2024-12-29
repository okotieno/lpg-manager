import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Body, UseGuards, ValidationPipe } from '@nestjs/common';
import { CurrentUser, JwtAuthGuard } from '@lpg-manager/auth';
import {
  PermissionGuard,
  Permissions,
  PermissionsEnum,
} from '@lpg-manager/permission-service';
import { CartService } from '@lpg-manager/cart-service';
import {
  IQueryParam,
  CartModel,
  CartCatalogueModel,
  CatalogueModel,
  UserModel,
  InventoryModel,
} from '@lpg-manager/db';
import { CreateCartInputDto } from '../dto/create-cart-input.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CartEvent } from '../events/cart.event';

@Resolver(() => CartModel)
export class CartResolver {
  constructor(
    private cartService: CartService,
    private eventEmitter: EventEmitter2
  ) {}

  @Mutation(() => CartModel)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.CreateCart)
  async createCart(
    @Body('params', new ValidationPipe()) params: CreateCartInputDto,
    @CurrentUser() user: UserModel
  ) {
    const cart = await this.cartService.create({
      userId: user.id,
    });
    if (params.items?.length) {
      await this.cartService.addItems(cart.id, params.items);
    }

    await this.cartService.updateCartTotals(cart.id);

    const cartWithItems = this.cartService.findById(cart.id, {
      include: [
        {
          model: CartCatalogueModel,
          include: [CatalogueModel],
        },
      ],
    });

    return {
      message: 'Cart created successfully',
      data: cartWithItems,
    };
  }

  @Mutation(() => CartModel)
  async addItemToCart(
    @Args('cartId') cartId: string,
    @Args('inventoryId') inventoryId: string,
    @Args('quantity') quantity: number
  ) {
    const cart = await this.cartService.addItem(cartId, inventoryId, quantity);
    return {
      message: 'Item added to cart successfully',
      data: cart,
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
      data: cart,
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
      data: cart,
    };
  }

  @Query(() => CartModel)
  async cart(@Args('id') id: string) {
    return this.cartService.findById(id);
  }

  @Query(() => CartModel)
  async carts(@Args('query') query: IQueryParam) {
    return this.cartService.findAll({
      ...query,
      filters: query?.filters ?? [],
    });
  }

  @Mutation(() => CartModel)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.UpdateCart)
  async completeCart(@Args('cartId') cartId: string) {
    const cart = await this.cartService.completeCart(cartId);

    this.eventEmitter.emit(
      'cart.completed',
      new CartEvent(cart as CartModel),
    );



    return {
      message: 'Cart completed successfully',
      data: { cart },
    };
  }

  @ResolveField('items')
  async getItems(@Parent() cart: CartModel) {
    const cartWithItems = await this.cartService.findById(cart.id, {
      include: [
        {
          model: CartCatalogueModel,
          include: [CatalogueModel, InventoryModel],
        },
      ],
    });

    return (
      cartWithItems?.items?.sort(({ createdAt: a }, { createdAt: b }) =>
        a <= b ? 1 : 0
      ) ?? []
    );
  }
}
