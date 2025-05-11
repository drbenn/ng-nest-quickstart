import { Component } from '@angular/core';
import { StandardPageWrapperComponent } from '../../../components/standard-page-wrapper/standard-page-wrapper.component';
import { dispatch, select } from '@ngxs/store';
import { getShoppingCartItems } from '../../../store/shopping-cart/shopping-cart.state';
import { RemoveItemFromShoppingCart } from '../../../store/shopping-cart/shopping-cart.actions';
import { StoreItem } from '../../../types/store.types';

@Component({
  selector: 'app-shopping-cart-page',
  imports: [StandardPageWrapperComponent],
  templateUrl: './shopping-cart-page.component.html',
  styleUrl: './shopping-cart-page.component.scss'
})
export class ShoppingCartPageComponent {
  protected cartItems = select(getShoppingCartItems);
  private removeItemFromCart = dispatch(RemoveItemFromShoppingCart);

  protected removeFromCart(id: number): void {
    this.removeItemFromCart(id);
  }
}
