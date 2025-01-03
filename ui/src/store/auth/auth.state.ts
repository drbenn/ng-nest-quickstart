import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { LoginUser, LogoutUser, SetAuthData } from './auth.actions';
import { patch } from '@ngxs/store/operators';

export interface NesteStateModel {
  option1: string[],
  option2: number
}
export interface AuthStateModel {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  imgUrl: string,
  roles: string[];
  dateJoined: Date;
  /**
   * Redux DevTools can only display serializable data (e.g., plain objects, arrays, numbers, strings).
   * If you store non-serializable data, it won't appear in the extension.
   */
  privateData: WeakMap<any, any>; // Not visible in Redux DevTools
  nestedData: NesteStateModel
}

@State<AuthStateModel>({
  name: 'authState',
  defaults: {
    id: '',
    firstName: '',
    lastName: '',
    fullName: '',
    email: '',
    imgUrl: '',
    roles: [],
    dateJoined: new Date(),
    privateData: new WeakMap(),
    nestedData: {
      option1: [],
      option2: 0
    }
  }
})
@Injectable()
export class AuthState {

  @Selector()
  static getNavUserData(state: AuthStateModel): Partial<AuthStateModel> {
    return {
      id: state.id,
      fullName: state.fullName,
      email: state.email,
    };
  }

  @Action(LoginUser)
  loginUser( { patchState }: StateContext<AuthStateModel>, { loginData }: LoginUser) {
    console.log('LOGIN USER');
    console.log(loginData);
    
    
    patchState({
      id: loginData.id,
      firstName: loginData.firstName,
      lastName: loginData.lastName,
      fullName: loginData.fullName,
      email: loginData.email,
      roles: loginData.roles,
      dateJoined: loginData.dateJoined
    });
  }

  @Action(LogoutUser)
  logoutUser( { patchState }: StateContext<AuthStateModel>) {
    patchState({
      id: '',
      firstName: '',
      lastName: '',
      fullName: '',
      email: '',
      roles: [],
      dateJoined: new Date()
    });
  }


  /**
   * Example to set private data(not visible by redux browser extension) on state
   */
  // @Action(SomeAction)
  // someAction(ctx: StateContext<AuthStateModel>, action: SomeAction) {
  //   const state = ctx.getState();
  //   const privateData = new WeakMap([[action.payload.key, action.payload.value]]);
  //   ctx.setState({ ...state, privateData });
  // }

  /**
   * example to set nested state data with NGSX patch operators
   */
  // @Action(SetNestedData)
  // setNestedData(
  //   { setState }: StateContext<AuthStateModel>,
  //   { payload }: SetNestedData) {
  //   setState(
  //     patch<AuthStateModel>({
  //       nestedData: patch<AuthStateModel['nestedData']>({
  //         option2: 3
  //   })}));
  // }

  @Action(SetAuthData)
  setAuthData(
    { setState }: StateContext<AuthStateModel>,
    { payload }: SetAuthData
  ) {
    setState(payload);
  }
}


  /**
   * set/get instance state are used with shallow copies of objects  to prevent unintentional mutations.
   * 
   * Good for:
   *  1. Preventing Unintentional Mutations: If you’re working in a team or an environment where components,
   *  services, or libraries might mistakenly mutate the state object.
   *  2. Transforming Data: If you foresee a need to process the state before returning it (e.g., adding 
   *  computed values, sanitizing fields, or modifying structure).
   *  3. Code Standards or Consistency: Some teams or organizations may enforce a convention of never 
   *  directly exposing the raw state to consumers.
   */

  // private static setInstanceState(state: AuthStateModel): AuthStateModel {
  //   return { ...state };
  // }

  // private static getInstanceState(state: AuthStateModel): AuthStateModel {
  //   return { ...state };
  // }

  // @Selector()
  // static getAuthData(state: AuthStateModel): AuthStateModel {
  //   return {...state };
  // }
