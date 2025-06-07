export declare class UserDto {
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
export declare class CreateUserDto {
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
export declare class RegisterStandardUserDto {
    email: string;
    password: string;
}
export declare class LoginStandardUserDto {
    email: string;
    password: string;
}
export declare class UserLoginJwtDto {
    accessToken: string;
    expiresIn: number | string;
}
export declare class RequestResetStandardPasswordDto {
    email: string;
}
export declare class ResetStandardPasswordDto {
    email: string;
    resetId: string;
    newPassword: string;
}
