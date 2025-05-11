import {
  State,
  Action,
  StateContext,
  createPropertySelectors,
} from '@ngxs/store';
import { StoreItem } from '../../types/store.types';
import { AddItemToShoppingCart, RemoveItemFromShoppingCart } from './shopping-cart.actions';

export interface ShoppingCartStateModel {
  cartItems: StoreItem[];
  count: number;
}

@State<ShoppingCartStateModel>({
  name: 'shoppingCartState',
  defaults: {
    cartItems: [],
    count: 0
  },
})
export class ShoppingCartState {
  @Action(AddItemToShoppingCart)
  addItemToShoppingCart(ctx: StateContext<ShoppingCartStateModel>, { item }: AddItemToShoppingCart) {
    let { cartItems, count } = ctx.getState();
    cartItems.push(item);
    count++;
    ctx.patchState({ 
      cartItems: cartItems,
      count: count
    });
  }

  @Action(RemoveItemFromShoppingCart)
  removeItemFromShoppingCart(ctx: StateContext<ShoppingCartStateModel>, { itemId }: RemoveItemFromShoppingCart) {
    let { cartItems, count } = ctx.getState();
    const index: number = cartItems.findIndex((item: StoreItem) => item.id === itemId);
    cartItems.splice(index, 1);
    count--;
    ctx.patchState({ 
      cartItems: cartItems,
      count: count
    });
  }
}

const _props = createPropertySelectors<ShoppingCartStateModel>(ShoppingCartState);

export const getShoppingCartCount = _props.count;
export const getShoppingCartItems = _props.cartItems;