import { AuthStateModel } from './auth.state';

export class SetAuthData {
  static readonly type = '[Auth] Auth data';
  constructor(readonly payload: AuthStateModel) {}
}


export class LoginUser {
  static readonly type = '[Auth] Login User';
  constructor(readonly loginData: Partial<AuthStateModel>) {}
}

export class LogoutUser {
  static readonly type = '[Auth] Logout User';
}