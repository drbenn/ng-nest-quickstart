import { StoreItem } from "../../types/store.types";

export class AddItemToShoppingCart {
  static readonly type = '[Shopping Cart] Add Shopping Cart Item';
  constructor(public item: StoreItem) {}
}

export class RemoveItemFromShoppingCart {
  static readonly type = '[Shopping Cart] Remove Shopping Cart Item';
  constructor(readonly itemId: number ) {}
}