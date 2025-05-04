import { Inject, Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { CheckAuthenticatedUser, LoginUser, LogoutUser } from './auth.actions';
import { Router } from '@angular/router';
import { AuthService } from '../../pages/auth/services/auth.service';
import { AuthResponseMessageDto, UserProfile } from '@common-types';

export interface NestedStateModel {
  option1: string[],
  option2: number
}
export interface AuthStateModel {
  id: number | null;
  email: string | null;
  username: string | null,
  first_name: string | null,
  last_name: string | null,
  full_name: string | null,
  img_url: string | null,
  created_at: Date | null,
  updated_at: Date | null,
  roles: string[] | null;
  settings: any | null;
  /**
   * Redux DevTools can only display serializable data (e.g., plain objects, arrays, numbers, strings).
   * If you store non-serializable data, it won't appear in the extension.
   */
  privateData: WeakMap<any, any>; // Not visible in Redux DevTools
  nestedData: NestedStateModel
}

@State<AuthStateModel>({
  name: 'authState',
  defaults: {
    id: null,
    email: null,
    username: null,
    first_name: null,
    last_name: null,
    full_name: null,
    img_url: null,
    created_at: null,
    updated_at: null,
    roles: null,
    settings: null,
    privateData: new WeakMap(),
    nestedData: {
      option1: [],
      option2: 0
    }
  }
})
@Injectable()
export class AuthState {

  constructor(
    @Inject(Router) private router: Router,
    private authService: AuthService,
    private store: Store
  ) {}

  @Selector()
  static getUserId(state: AuthStateModel): Partial<number | null> {
    return state.id;
  }

  @Selector()
  static getNavUserData(state: AuthStateModel): Partial<AuthStateModel> {
    return {
      id: state.id,
      full_name: state.first_name && state.last_name ? `${state.first_name} ${state.last_name}` : null,
      email: state.email,
      created_at: state.created_at,
      img_url: state.img_url
    };
  }

  @Action(LoginUser)
  loginUser( { patchState }: StateContext<AuthStateModel>, { userProfile }: LoginUser) {
    console.log('state loginData: ', userProfile);
    
    patchState({
      id: userProfile.id,
      email: userProfile.email,
      first_name: userProfile.first_name ? userProfile.first_name : null,
      last_name: userProfile.last_name ? userProfile.last_name : null,
      full_name: userProfile.first_name && userProfile.last_name ? `${userProfile.first_name} ${userProfile.last_name}` : null,
      img_url: userProfile.img_url ? userProfile.img_url : null,
      created_at: userProfile.created_at,
      updated_at: userProfile.updated_at,
      roles: userProfile.roles ? userProfile.roles : null,
      settings: userProfile.settings ? userProfile.settings : null
    });

    this.router.navigate(['home']);
  }

  @Action(LogoutUser)
  logoutUser( { patchState }: StateContext<AuthStateModel>) {
    this.authService.logoutAuthenticatedUser().subscribe({
      next: (logoutResponse: AuthResponseMessageDto) => {
        patchState({
          id: null,
          email: null,
          first_name: null,
          last_name: null,
          full_name: null,
          img_url: null,
          created_at: null,
          updated_at: null,
          roles: null,
          settings: null
        });
        this.router.navigate(['']);
      },
      error: (err) => {
        console.log('User logout failed:', err);
      },
    });

  };

  @Action(CheckAuthenticatedUser)
  async checkAuthenticatedUser( { patchState }: StateContext<AuthStateModel>) {
    console.log('checking authenticated user in state hit');
    
    this.authService.getAuthenticatedUser().subscribe({
      next: (user: UserProfile) => {
        console.log('User is logged in:', user);
        this.store.dispatch(new LoginUser(user));
        this.router.navigate(['home']);
      },
      error: (err) => {
        console.log('User is not logged in:', err);
        // Handle the case where the user is not authenticated
      },
    });


  };


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

  // @Action(SetAuthData)
  // setAuthData(
  //   { setState }: StateContext<AuthStateModel>,
  //   { payload }: SetAuthData
  // ) {
  //   setState(payload);
  // }
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
// 