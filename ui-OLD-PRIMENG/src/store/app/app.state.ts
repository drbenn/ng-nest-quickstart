import {
  State,
  Action,
  StateContext,
  createPropertySelectors,
} from '@ngxs/store';
import { Add, DisplayToast } from './app.actions';
import { ToastMessageOptions } from 'primeng/api';


export interface AppStateModel {
  count: number;
  toast: ToastMessageOptions | null;
}

@State<AppStateModel>({
  name: 'appState',
  defaults: {
    count: 0,
    toast: null,
  },
})
export class AppState {
  
  @Action(Add)
  add(ctx: StateContext<AppStateModel>, action: Add) {
    const state = ctx.getState();
    ctx.patchState({ count: state.count + action.amount });
  }

  @Action(DisplayToast)
  displayToast( {patchState }: StateContext<any>, { message }: DisplayToast) {
    patchState({
      toast: message
    })
  };
}

const _props = createPropertySelectors<AppStateModel>(AppState);

export const getCount = _props.count;

export const getToast = _props.toast;