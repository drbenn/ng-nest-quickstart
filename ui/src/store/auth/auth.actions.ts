import { UserLoginJwtDto } from '../../types/userDto.types';
export class LoginUser {
  static readonly type = '[Auth] Login User';
  constructor(readonly loginData: UserLoginJwtDto) {}
}

export class LogoutUser {
  static readonly type = '[Auth] Logout User';
}

export class CheckAuthenticatedUser {
  static readonly type = '[Auth] Check Authenticated User On App Init';
}