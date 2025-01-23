import { User } from "src/users/user.entity";

export class ResponseMessageDto {
  message: string;
  email?: string;
  provider?: string;
  isRedirect?: boolean;
  redirectPath?: string;
}

export class UserWithTokensDto {
  user: Partial<User>;
  jwtAccessToken: string;
  jwtRefreshToken: string;
}
