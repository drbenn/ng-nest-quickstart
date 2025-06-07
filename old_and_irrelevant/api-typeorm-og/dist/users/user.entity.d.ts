export declare class User {
    id: number;
    email: string;
    password: string;
    refresh_token: string;
    oauth_provider: string;
    oauth_provider_user_id: string;
    created_at: Date;
    updated_at: Date;
    first_name: string;
    last_name: string;
    full_name: string;
    img_url: string;
    reset_id: string;
    settings: Record<string, any>;
}
