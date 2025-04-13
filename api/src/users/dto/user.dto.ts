export class RegisterStandardUserDto {
  email: string;
  password: string;
}

export class LoginStandardUserDto {
  email: string;
  password: string;
}

export class UserLoginJwtDto {
  accessToken: string;
  expiresIn: number | string;
}

export class RequestResetStandardUserPasswordDto {
  email: string;
}

export interface ResetStandardUserPasswordDto {
  email: string,
  reset_id: string,
  new_password: string
}

