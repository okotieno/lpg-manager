import { signalStore, withState, withComputed } from '@ngrx/signals';
import { IOrderModel } from '@lpg-manager/types';
import { computed } from '@angular/core';

interface OrderState {
  orders: IOrderModel[];
}

const initialState: OrderState = {
  orders: [],
};

export const OrderStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    orderCount: computed(()  => store.orders.length),
  }))
);
