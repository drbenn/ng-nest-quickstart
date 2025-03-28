export class UserDto {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  img_url: string;
  provider: string;
  roles: string[];
  date_joined: Date;
  last_login: Date;
  settings?: Record<string, any>;
}

export class CreateUserDto {
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  img_url: string;
  provider: string;
  roles: string[];
  date_joined: Date;
  last_login: Date;
  settings?: Record<string, any>;
}

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

export class RequestResetStandardPasswordDto {
  email: string;
}

export class ResetStandardPasswordDto {
  email: string;
  resetId: string;
  newPassword: string;
}