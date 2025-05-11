import { Component } from '@angular/core';
import { StandardPageWrapperComponent } from '../../../components/standard-page-wrapper/standard-page-wrapper.component';
import { storeItems } from '../../../../../public/store/store-items';
import { StoreItem } from '../../../types/store.types';
import { dispatch } from '@ngxs/store';
import { AddItemToShoppingCart } from '../../../store/shopping-cart/shopping-cart.actions';

@Component({
  selector: 'app-store-page',
  imports: [StandardPageWrapperComponent],
  templateUrl: './store-page.component.html',
  styleUrl: './store-page.component.scss'
})
export class StorePageComponent {
  protected storeMerch: StoreItem[] = storeItems;
  private addItemToCart = dispatch(AddItemToShoppingCart);

  protected addToCart(item: StoreItem): void {
    this.addItemToCart(item);
  }
}
