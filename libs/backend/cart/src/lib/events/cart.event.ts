import { CartModel } from '@lpg-manager/db';

export class CartEvent {
  constructor(public cart: CartModel) {}
}
