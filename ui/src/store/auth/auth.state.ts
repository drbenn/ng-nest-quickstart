import { Inject, Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { CheckAuthenticatedUser, LoginUser, LogoutUser } from './auth.actions';
import { patch } from '@ngxs/store/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../pages/auth/services/auth.service';
import { UserLoginJwtDto } from '../../types/userDto.types';

export interface NesteStateModel {
  option1: string[],
  option2: number
}
export interface AuthStateModel {
  id: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  imgUrl: string | null,
  oauthProvider: string | null,
  createdAt: Date | null,
  updatedAt: Date | null,
  roles: string[] | null;
  settings: any | null;
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
    id: null,
    email: null,
    firstName: null,
    lastName: null,
    fullName: null,
    imgUrl: null,
    oauthProvider: null,
    createdAt: null,
    updatedAt: null,
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
  static getNavUserData(state: AuthStateModel): Partial<AuthStateModel> {
    return {
      id: state.id,
      fullName: state.fullName,
      email: state.email,
      createdAt: state.createdAt,
      imgUrl: state.imgUrl
    };
  }

  @Action(LoginUser)
  loginUser( { patchState }: StateContext<AuthStateModel>, { loginData }: LoginUser) {
    patchState({
      id: loginData.id,
      email: loginData.email,
      firstName: loginData.first_name,
      lastName: loginData.last_name,
      fullName: loginData.full_name,
      imgUrl: loginData.img_url,
      oauthProvider: loginData.oauth_provider,
      createdAt: loginData.created_at,
      updatedAt: loginData.updated_at,
      roles: loginData.roles,
      settings: loginData.settings
    });

    this.router.navigate(['home']);
  }

  @Action(LogoutUser)
  logoutUser( { patchState }: StateContext<AuthStateModel>) {
    this.authService.logoutAuthenticatedUser().subscribe({
      next: (user: UserLoginJwtDto) => {
        patchState({
          id: null,
          email: null,
          firstName: null,
          lastName: null,
          fullName: null,
          imgUrl: null,
          oauthProvider: null,
          createdAt: null,
          updatedAt: null,
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
      next: (user: UserLoginJwtDto) => {
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