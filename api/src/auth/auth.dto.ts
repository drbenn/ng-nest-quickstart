import { User } from "src/users/user.entity";

export class AuthResponseMessageDto {
  message?: string;
  user?: Partial<User>;
  email?: string;
  provider?: string;
  isRedirect?: boolean;
  jwtAccessToken?: string;
  jwtRefreshToken?: string;
}

// export class UserWithTokensDto {
//   user: Partial<User>;
//   jwtAccessToken: string;
//   jwtRefreshToken: string;
// }
