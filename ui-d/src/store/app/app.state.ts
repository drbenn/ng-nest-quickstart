import {
  State,
  Action,
  StateContext,
  createPropertySelectors,
} from '@ngxs/store';
import { DaisyToastOptions } from '../../types/app.types';
import { Add, DisplayToast, UpdateTheme } from './app.actions';

export interface AppStateModel {
  theme: string;
  count: number;
  toast: DaisyToastOptions | null;
}

@State<AppStateModel>({
  name: 'appState',
  defaults: {
    theme: 'light',
    count: 0,
    toast: null,
  },
})
export class AppState {

  @Action(UpdateTheme)
  updateTheme({ patchState }: StateContext<AppStateModel>, { theme }: UpdateTheme) {
    patchState({ theme: theme });
  }

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
