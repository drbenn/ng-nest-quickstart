import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { User } from 'src/users/user.types';
import { LoginTrackingTypes } from './sql-auth.types';

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
  //                            USER FINDER HELPERS                               //
  //                                                                              //
  //////////////////////////////////////////////////////////////////////////////////

  async findOneUserById(userId: number): Promise<Partial<User> | null> {
    const queryText = `SELECT * FROM users WHERE id = $1;`;
    const paramsToArray: number[] = [userId];
    try {
      const queryResult = await this.pool.query(queryText, paramsToArray);
      const result: Partial<User> = queryResult.rows[0];
      return result;
    } catch (error) {
      console.error(`Error Auth-SQL Service findOneUserById: ${error}`);
      this.logger.log('warn', `Error Auth-SQL Service findOneUserById: ${error}`);
      throw new Error('Error Auth-SQL Service findOneUserById');
    }
  }

  async findOneUserByEmail(email: string): Promise<Partial<User> | null> {
    const queryText = `SELECT * FROM users WHERE email = $1;`;
    const paramsToArray: string[] = [email];
    try {
      const queryResult = await this.pool.query(queryText, paramsToArray);
      const result: Partial<User> = queryResult.rows[0]; 
      return result;
    } catch (error) {
      console.error(`Error Auth-SQL Service findOneUserByEmail: ${error}`);
      this.logger.log('warn', `Error Auth-SQL Service findOneUserByEmail: ${error}`);
      this.logger.log('warn', `Error Auth-SQL Service findOneUserByEmail EMAIL: ${email}`);
      throw new Error('Error Auth-SQL Service findOneUserByEmail');
    }
  }

  async findOneUserByEmailAndPassword(email: string, hashedPassword: string): Promise<Partial<User> | null> {
    const queryText = `SELECT * FROM users WHERE email = $1 AND password = $2;`;
    const paramsToArray: string[] = [email, hashedPassword];
    try {
      const queryResult = await this.pool.query(queryText, paramsToArray);
      const result: Partial<User> = queryResult.rows[0]; 
      return result;
    } catch (error) {
      console.error(`Error Auth-SQL Service findOneUserByEmailAndPassword: ${error}`);
      this.logger.log('warn', `Error Auth-SQL Service findOneUserByEmailAndPassword: ${error}`);
      throw new Error('Error Auth-SQL Service findOneUserByEmailAndPassword');
    }
  }

  async findOneUserByEmailAndResetId(email: string, reset_id: string): Promise<Partial<User> | null> {
    const queryText = `SELECT * FROM users WHERE email = $1 AND reset_id = $2;`;
    const paramsToArray: string[] = [email, reset_id];
    try {
      const queryResult = await this.pool.query(queryText, paramsToArray);
      const result: Partial<User> = queryResult.rows[0]; 
      return result;
    } catch (error) {
      console.error(`Error Auth-SQL Service findOneUserByEmail: ${error}`);
      this.logger.log('warn', `Error Auth-SQL Service findOneUserByEmail: ${error}`);
      throw new Error('Error Auth-SQL Service findOneUserByEmail');
    }
  }

  async findOneUserByProvider(oauth_provider: string, oauth_provider_user_id: string): Promise<Partial<User> | null> {
    const queryText = `SELECT * FROM users WHERE oauth_provider = $1 AND oauth_provider_user_id = $2;`;
    const paramsToArray: string[] = [oauth_provider, oauth_provider_user_id];
    try {
      const queryResult = await this.pool.query(queryText, paramsToArray);
      const result: Partial<User> = queryResult.rows[0]; 
      return result;
    } catch (error) {
      console.error(`Error Auth-SQL Service findOneUserByProvider: ${error}`);
      this.logger.log('warn', `Error Auth-SQL Service findOneUserByProvider: ${error}`);
      throw new Error('Error Auth-SQL Service findOneUserByProvider');
    }
  }

  async findOneUserByRefreshToken(refresh_token: string): Promise<Partial<User> | null> {
    const queryText = `SELECT * FROM users WHERE refresh_token = $1;`;
    const paramsToArray: string[] = [refresh_token];
    try {
      const queryResult = await this.pool.query(queryText, paramsToArray);
      const result: Partial<User> = queryResult.rows[0]; 
      return result;
    } catch (error) {
      console.error(`Error Auth-SQL Service findOneUserByRefreshToken: ${error}`);
      this.logger.log('warn', `Error Auth-SQL Service findOneUserByRefreshToken: ${error}`);
      this.logger.log('warn', `Error Auth-SQL Service findOneUserByRefreshToken REFRESH_TOKEN: ${refresh_token}`);
      throw new Error('Error Auth-SQL Service findOneUserByRefreshToken');
    }
  }

  //////////////////////////////////////////////////////////////////////////////////
  //                                                                              //
  //                           JWT ACCESS/REFRESH HELPERS                         //
  //                                                                              //
  //////////////////////////////////////////////////////////////////////////////////

  async updateUsersRefreshTokenInDatabase(userId: number, refreshToken: string): Promise<Partial<User> | null> {
    const queryText = `UPDATE users SET refresh_token = $1 WHERE id = $2 RETURNING *;`;
    const paramsToArray: [string, number] = [refreshToken, userId];
    try {
      const queryResult = await this.pool.query(queryText, paramsToArray);
      const result: Partial<User> = queryResult.rows[0]; 
      return result;
    } catch (error) {
      console.error(`Error Auth-SQL Service updateUsersRefreshTokenInDatabase: ${error}`);
      this.logger.log('warn', `Error Auth-SQL Service updateUsersRefreshTokenInDatabase: ${error}`);
      throw new Error('Error Auth-SQL Service updateUsersRefreshTokenInDatabase');
    }
  }

  //////////////////////////////////////////////////////////////////////////////////
  //                                                                              //
  //                           STANDARD USER HELPERS                              //
  //                                                                              //
  //////////////////////////////////////////////////////////////////////////////////

  async insertStandardUser(email: string, hashedPassword: string, reset_id: string): Promise<Partial<User>> {
    const queryText = `INSERT INTO users (email, password, reset_id) VALUES ($1, $2, $3) RETURNING *;`;
    const paramsToArray: string[] = [email, hashedPassword, reset_id];
    try {
      const queryResult = await this.pool.query(queryText, paramsToArray);
      console.log('insert standard user result: ', queryResult);
      
      const result: Partial<User> = queryResult.rows[0]; 
      return result;
    } catch (error) {
      
      console.error(`Error Auth-SQL Service insertStandardUser: ${error}`);
      this.logger.log('warn', `Error Auth-SQL Service insertStandardUser: ${error}`);
      this.logger.log('warn', `Error Auth-SQL Service insertStandardUser OBJECT: email: ${email}    hashedPassword: ${hashedPassword}       reset_id: ${reset_id}`);
      throw new Error('Error Auth-SQL Service insertStandardUser');
    }
  }

  async updateStandardUserPasswordAndResetId(email: string, hashedPassword: string, reset_id: string): Promise<Partial<User>> {
    const queryText = `UPDATE users SET password = $1, reset_id = $2 WHERE email = $3 RETURNING *;`;
    const paramsToArray: string[] = [hashedPassword, reset_id, email];
    try {
      const queryResult = await this.pool.query(queryText, paramsToArray);
      const result: Partial<User> = queryResult.rows[0];
      return result;
    } catch (error) {
      console.error(`Error Auth-SQL Service updateStandardUserPasswordAndResetId: ${error}`);
      this.logger.log('warn', `Error Auth-SQL Service updateStandardUserPasswordAndResetId: ${error}`);
      throw new Error('Error Auth-SQL Service updateStandardUserPasswordAndResetId');
    }
  }


  //////////////////////////////////////////////////////////////////////////////////
  //                                                                              //
  //                            OAUTH USER HELPERS                                //
  //                                                                              //
  //////////////////////////////////////////////////////////////////////////////////

  async insertOauthUser(email: string, full_name: string, img_url: string, oauth_provider: string, oauth_provider_user_id: string): Promise<Partial<User>> {
    const queryText = `
      INSERT INTO users (email, full_name, img_url, oauth_provider, oauth_provider_user_id)
      VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;
    const paramsToArray: string[] = [email, full_name, img_url, oauth_provider, oauth_provider_user_id];
    try {
      const queryResult = await this.pool.query(queryText, paramsToArray);
      const result: Partial<User> = queryResult.rows[0];
      return result;
    } catch (error) {
      console.error(`Error Auth-SQL Service insertStandardUser: ${error}`);
      this.logger.log('warn', `Error Auth-SQL Service insertStandardUser: ${error}`);
      throw new Error('Error Auth-SQL Service insertStandardUser');
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
