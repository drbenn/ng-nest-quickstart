import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { CreateUserProfile, LoginStatus, UserLogin, UserLoginProvider, UserProfile } from '@common-types';

@Injectable()
export class SqlAuthService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  constructor(
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    this.pool = new Pool({
      host: this.configService.get<string>('POSTGRES_HOST'),
      port: this.configService.get<number>('POSTGRES_PORT'),
      user: this.configService.get<string>('POSTGRES_USER'),
      password: this.configService.get<string>('POSTGRES_PASSWORD'),
      database: this.configService.get<string>('POSTGRES_DB'),
    });
  }

  async onModuleInit() {
    console.log('Database connected');
  }

  async query(queryText: string, params?: any[]) {
    return this.pool.query(queryText, params);
  }

  async onModuleDestroy() {
    await this.pool.end();
    console.log('Database connection closed');
  }

  //////////////////////////////////////////////////////////////////////////////////
  //                                                                              //
  //                        USER_LOGIN FINDER HELPERS                             //
  //                                                                              //
  //////////////////////////////////////////////////////////////////////////////////

  async findOneUserLoginById(userLoginId: number): Promise<Partial<UserLogin> | null> {
    const queryText = `SELECT * FROM user_logins WHERE id = $1;`;
    const paramsToArray: number[] = [userLoginId];
    try {
      const queryResult = await this.pool.query(queryText, paramsToArray);
      const result: Partial<UserLogin> = queryResult.rows[0];
      return result;
    } catch (error) {
      console.error(`Error Auth-SQL Service findOneUserLoginById: ${error}`);
      this.logger.log('warn', `Error Auth-SQL Service findOneUserLoginById: ${error}`);
      throw new Error('Error Auth-SQL Service findOneUserLoginById');
    }
  }

  async findOneUserLoginByEmail(email: string): Promise<Partial<UserLogin> | null> {
    const queryText = `SELECT * FROM user_logins WHERE email = $1;`;
    const paramsToArray: string[] = [email];
    try {
      const queryResult = await this.pool.query(queryText, paramsToArray);
      const result: Partial<UserLogin> = queryResult.rows[0]; 
      return result;
    } catch (error) {
      console.error(`Error Auth-SQL Service findOneUserLoginByEmail: ${error}`);
      this.logger.log('warn', `Error Auth-SQL Service findOneUserLoginByEmail: ${error}`);
      this.logger.log('warn', `Error Auth-SQL Service findOneUserLoginByEmail EMAIL: ${email}`);
      throw new Error('Error Auth-SQL Service findOneUserLoginByEmail');
    }
  }

  async findOneUserLoginByEmailAndProvider(email: string, login_provider: UserLoginProvider): Promise<Partial<UserLogin> | null> {
    const queryText = `SELECT * FROM user_logins WHERE email = $1 AND login_provider = $2;`;
    const paramsToArray: string[] = [email, login_provider];
    try {
      const queryResult = await this.pool.query(queryText, paramsToArray);
      const result: Partial<UserLogin> = queryResult.rows[0]; 
      return result;
    } catch (error) {
      console.error(`Error Auth-SQL Service findOneUserLoginByEmailAndProvider: ${error}`);
      this.logger.log('warn', `Error Auth-SQL Service findOneUserLoginByEmailAndProvider: ${error}`);
      this.logger.log('warn', `Error Auth-SQL Service findOneUserLoginByEmailAndProvider EMAIL: ${email}   PROVIDER: ${login_provider}`);
      throw new Error('Error Auth-SQL Service findOneUserLoginByEmailAndProvider');
    }
  }

  async findOneUserLoginByEmailAndPassword(email: string, hashedPassword: string): Promise<Partial<UserLogin> | null> {
    const queryText = `SELECT * FROM user_logins WHERE email = $1 AND password = $2;`;
    const paramsToArray: string[] = [email, hashedPassword];
    try {
      const queryResult = await this.pool.query(queryText, paramsToArray);
      const result: Partial<UserLogin> = queryResult.rows[0]; 
      return result;
    } catch (error) {
      console.error(`Error Auth-SQL Service findOneUserLoginByEmailAndPassword: ${error}`);
      this.logger.log('warn', `Error Auth-SQL Service findOneUserLoginByEmailAndPassword: ${error}`);
      throw new Error('Error Auth-SQL Service findOneUserLoginByEmailAndPassword');
    }
  }

  async findOneUserLoginByEmailAndResetId(email: string, reset_id: string): Promise<Partial<UserLogin> | null> {
    const queryText = `SELECT * FROM user_logins WHERE email = $1 AND reset_id = $2;`;
    const paramsToArray: string[] = [email, reset_id];
    try {
      const queryResult = await this.pool.query(queryText, paramsToArray);
      const result: Partial<UserLogin> = queryResult.rows[0]; 
      return result;
    } catch (error) {
      console.error(`Error Auth-SQL Service findOneUserLoginByEmailAndResetId: ${error}`);
      this.logger.log('warn', `Error Auth-SQL Service findOneUserLoginByEmailAndResetId: ${error}`);
      throw new Error('Error Auth-SQL Service findOneUserLoginByEmailAndResetId');
    }
  }

  async findOneUserLoginByProvider(login_provider: string, provider_user_id: string): Promise<Partial<UserLogin> | null> {
    const queryText = `SELECT * FROM user_logins WHERE login_provider = $1 AND provider_user_id = $2;`;
    const paramsToArray: string[] = [login_provider, provider_user_id];
    try {
      const queryResult = await this.pool.query(queryText, paramsToArray);
      const result: Partial<UserLogin> = queryResult.rows[0]; 
      return result;
    } catch (error) {
      console.error(`Error Auth-SQL Service findOneUserLoginByProvider: ${error}`);
      this.logger.log('warn', `Error Auth-SQL Service findOneUserLoginByProvider: ${error}`);
      throw new Error('Error Auth-SQL Service findOneUserLoginByProvider');
    }
  }

  //////////////////////////////////////////////////////////////////////////////////
  //                                                                              //
  //                           STANDARD USER HELPERS                              //
  //                                                                              //
  //////////////////////////////////////////////////////////////////////////////////

  async insertStandardUserLogin(profile_id: number, email: string, hashedPassword: string, reset_id: string): Promise<Partial<UserLogin>> {
    const queryText = `INSERT INTO user_logins (profile_id, email, standard_login_password, reset_id, login_provider, login_status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`;
    const paramsToArray: (number | string)[] = [profile_id, email, hashedPassword, reset_id, UserLoginProvider.email, LoginStatus.UNCONFIRMED_EMAIL];
    try {
      const queryResult = await this.pool.query(queryText, paramsToArray);
      console.log('insert standard user login result: ', queryResult.rows[0]);
      
      const result: Partial<UserLogin> = queryResult.rows[0]; 
      return result;
    } catch (error) {
      
      console.error(`Error Auth-SQL Service insertStandardUserLogin: ${error}`);
      this.logger.log('warn', `Error Auth-SQL Service insertStandardUserLogin: ${error}`);
      this.logger.log('warn', `Error Auth-SQL Service insertStandardUserLogin OBJECT: email: ${email}    hashedPassword: ${hashedPassword}       reset_id: ${reset_id}`);
      throw new Error('Error Auth-SQL Service insertStandardUserLogin');
    }
  }

  async updateStandardUserLoginPasswordAndResetId(email: string, hashedPassword: string, reset_id: string): Promise<Partial<UserLogin>> {
    const queryText = `UPDATE user_logins SET standard_login_password = $1, reset_id = $2 WHERE email = $3 RETURNING *;`;
    const paramsToArray: string[] = [hashedPassword, reset_id, email];
    try {
      const queryResult = await this.pool.query(queryText, paramsToArray);
      const result: Partial<UserLogin> = queryResult.rows[0];
      return result;
    } catch (error) {
      console.error(`Error Auth-SQL Service updateStandardUserLoginPasswordAndResetId: ${error}`);
      this.logger.log('warn', `Error Auth-SQL Service updateStandardUserLoginPasswordAndResetId: ${error}`);
      throw new Error('Error Auth-SQL Service updateStandardUserLoginPasswordAndResetId');
    }
  }

  async updateStandardUserLoginStatusToActive(email: string): Promise<Partial<UserLogin>> {
    const queryText = `UPDATE user_logins SET login_status = $1 WHERE email = $2 AND login_provider = $3 RETURNING *;`;
    const paramsToArray: string[] = [LoginStatus.ACTIVE, email, UserLoginProvider.email];
    try {
      const queryResult = await this.pool.query(queryText, paramsToArray);
      const result: Partial<UserLogin> = queryResult.rows[0];
      return result;
    } catch (error) {
      console.error(`Error Auth-SQL Service updateStandardUserLoginStatusToActive: ${error}`);
      this.logger.log('warn', `Error Auth-SQL Service updateStandardUserLoginStatusToActive: ${error}`);
      throw new Error('Error Auth-SQL Service updateStandardUserLoginStatusToActive');
    }
  }


  //////////////////////////////////////////////////////////////////////////////////
  //                                                                              //
  //                            OAUTH USER HELPERS                                //
  //                                                                              //
  //////////////////////////////////////////////////////////////////////////////////

  async insertOauthUserLogin(
    profile_id: number,
    email: string,
    full_name: string,
    login_provider: string,
    provider_user_id: string
  ): Promise<Partial<UserLogin>> {
    const queryText = `
      INSERT INTO user_logins (profile_id, email, full_name, login_provider, provider_user_id)
      VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;
    const paramsToArray: (number | string)[] = [profile_id, email, full_name, login_provider, provider_user_id];
    try {
      const queryResult = await this.pool.query(queryText, paramsToArray);
      const result: Partial<UserLogin> = queryResult.rows[0];
      return result;
    } catch (error) {
      console.error(`Error Auth-SQL Service insertOauthUserLogin: ${error}`);
      this.logger.log('warn', `Error Auth-SQL Service insertOauthUserLogin: ${error}`);
      throw new Error('Error Auth-SQL Service insertOauthUserLogin');
    }
  }

  //////////////////////////////////////////////////////////////////////////////////
  //                                                                              //
  //                           USER PROFILE HELPERS                               //
  //                                                                              //
  //////////////////////////////////////////////////////////////////////////////////


  async findOneUserProfileById(userProfileId: number): Promise<Partial<UserProfile> | null> {
    const queryText = `SELECT * FROM user_profiles WHERE id = $1;`;
    const paramsToArray: number[] = [userProfileId];
    try {
      const queryResult = await this.pool.query(queryText, paramsToArray);
      const result: Partial<UserProfile> = queryResult.rows[0];
      return result;
    } catch (error) {
      console.error(`Error Auth-SQL Service findOneUserProfileById: ${error}`);
      this.logger.log('warn', `Error Auth-SQL Service findOneUserProfileById: ${error}`);
      throw new Error('Error Auth-SQL Service findOneUserProfileById');
    }
  }

  async findOneUserProfileByEmail(email: string): Promise<Partial<UserProfile> | null> {
    const queryText = `SELECT * FROM user_profiles WHERE email = $1;`;
    const paramsToArray: string[] = [email];
    try {
      const queryResult = await this.pool.query(queryText, paramsToArray);
      const result: Partial<UserProfile> = queryResult.rows[0];

      console.warn('findoneuserProfile by email SQL REsult:: ', result)
      return result;
    } catch (error) {
      console.error(`Error Auth-SQL Service findOneUserProfileByEmail: ${error}`);
      this.logger.log('warn', `Error Auth-SQL Service findOneUserProfileByEmail: ${error}`);
      this.logger.log('warn', `Error Auth-SQL Service findOneUserProfileByEmail EMAIL: ${email}`);
      throw new Error('Error Auth-SQL Service findOneUserProfileByEmail');
    }
  }

  async insertUserProfile(createUserProfile: CreateUserProfile): Promise<Partial<UserProfile>> {
    const { email, first_name, last_name, refresh_token } = createUserProfile;
    
    const queryText: string = `INSERT INTO user_profiles (email, first_name, last_name, refresh_token) 
    VALUES ($1, $2, $3, $4) RETURNING *;`;

    const paramsToArray: string[] = [
      email,
      first_name ? first_name : '',
      last_name ? last_name : '',
      refresh_token ? refresh_token : ''
    ];


    try {
      const queryResult = await this.pool.query(queryText, paramsToArray);
      console.log('insert user profile result: ', queryResult);
      const result: Partial<UserProfile> = queryResult.rows[0]; 
      return result;
    } catch (error) {
      console.error(`Error Auth-SQL Service insertUserProfile: ${error}`);
      this.logger.log('warn', `Error Auth-SQL Service insertUserProfile: ${error}`);
      throw new Error('Error Auth-SQL Service insertUserProfile');
    }
  }

  async updateUserProfile(userProfile: UserProfile): Promise<Partial<UserProfile>> {
    const { email, username, first_name, last_name, img_url } = userProfile;
    const queryText = `UPDATE user_profiles SET username = $1, first_name = $2,  last_name = $3, img_url = $4 WHERE email = $5 RETURNING *;`;
    const paramsToArray: string[] = [username, first_name, last_name, img_url, email];
    try {
      const queryResult = await this.pool.query(queryText, paramsToArray);
      const result: Partial<UserProfile> = queryResult.rows[0];
      return result;
    } catch (error) {
      console.error(`Error Auth-SQL Service updateUserProfile: ${error}`);
      this.logger.log('warn', `Error Auth-SQL Service updateUserProfile: ${error}`);
      throw new Error('Error Auth-SQL Service updateUserProfile');
    }
  }

  async findOneUserProfileByRefreshToken(refresh_token: string): Promise<Partial<UserProfile> | null> {
    const queryText = `SELECT * FROM user_profiles WHERE refresh_token = $1;`;
    const paramsToArray: string[] = [refresh_token];
    try {
      const queryResult = await this.pool.query(queryText, paramsToArray);
      const result: Partial<UserProfile> = queryResult.rows[0]; 
      return result;
    } catch (error) {
      console.error(`Error Auth-SQL Service findOneUserProfileByRefreshToken: ${error}`);
      this.logger.log('warn', `Error Auth-SQL Service findOneUserProfileByRefreshToken: ${error}`);
      this.logger.log('warn', `Error Auth-SQL Service findOneUserProfileByRefreshToken REFRESH_TOKEN: ${refresh_token}`);
      throw new Error('Error Auth-SQL Service findOneUserProfileByRefreshToken');
    }
  }

  async updateUsersRefreshTokenInUserProfile(userProfileId: number, refreshToken: string): Promise<Partial<UserProfile> | null> {
    const queryText = `UPDATE user_profiles SET refresh_token = $1 WHERE id = $2 RETURNING *;`;
    const paramsToArray: [string, number] = [refreshToken, userProfileId];
    try {
      const queryResult = await this.pool.query(queryText, paramsToArray);
      const result: Partial<UserProfile> = queryResult.rows[0];
      console.log('uopdate uwer refresh token result::: ', result);
      
      return result;
    } catch (error) {
      console.error(`Error Auth-SQL Service updateUsersRefreshTokenInUserProfiles: ${error}`);
      this.logger.log('warn', `Error Auth-SQL Service updateUsersRefreshTokenInUserProfiles: ${error}`);
      throw new Error('Error Auth-SQL Service updateUsersRefreshTokenInUserProfiles');
    }
  }


  //////////////////////////////////////////////////////////////////////////////////
  //                                                                              //
  //                           USER LOGIN HISTORY HELPERS                         //
  //                                                                              //
  //////////////////////////////////////////////////////////////////////////////////

  // async insertUserLoginTracking(user_id: number, ip: string, type: LoginTrackingTypes): Promise<Partial<User>> {
  //   const queryText = `
  //     INSERT INTO users_login_history (user_id, ip, type)
  //     VALUES ($1, $2, $3);
  //   `;
  //   const paramsToArray: [number, string, LoginTrackingTypes] = [user_id, ip, type];
  //   try {
  //     const queryResult = await this.pool.query(queryText, paramsToArray);
  //     const result: Partial<User> = queryResult.rows[0];
  //     return result;
  //   } catch (error) {
  //     console.error(`Error Auth-SQL Service insertUserLoginTracking: ${error}`);
  //     this.logger.log('warn', `Error Auth-SQL Service insertUserLoginTracking: ${error}`);
  //     throw new Error('Error Auth-SQL Service insertUserLoginTracking');
  //   }
  // }
}
