import {
  State,
  Action,
  StateContext,
  createPropertySelectors,
} from '@ngxs/store';
import { Add } from './app.actions';

export interface AppStateModel {
  count: number;
}

@State<AppStateModel>({
  name: 'appState',
  defaults: {
    count: 0,
  },
})
export class AppState {
  @Action(Add)
  add(ctx: StateContext<AppStateModel>, action: Add) {
    const state = ctx.getState();
    ctx.patchState({ count: state.count + action.amount });
  }
}

const _props = createPropertySelectors<AppStateModel>(AppState);

export const getCount = _props.count;