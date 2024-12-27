import { signalStore, withState, withComputed } from '@ngrx/signals';
import { IOrder } from '@lpg-manager/types';

interface OrderState {
  orders: IOrder[];
}

const initialState: OrderState = {
  orders: [],
};

export const OrderStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    orderCount: () => store.orders.length,
  }))
); 