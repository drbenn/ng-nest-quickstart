import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Pool } from 'pg';
import { TodoDto } from '@common-types';

@Injectable()
export class SqlTodoService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  constructor(
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
      try {
        this.pool = new Pool({
          host: this.configService.get<string>('POSTGRES_HOST'),
          port: this.configService.get<number>('POSTGRES_PORT'),
          user: this.configService.get<string>('POSTGRES_USER'),
          password: this.configService.get<string>('POSTGRES_PASSWORD'),
          database: this.configService.get<string>('POSTGRES_DB'),
          // max: 20,
          // min: 4,
          // idleTimeoutMillis: 30000,
          // connectionTimeoutMillis: 5000,
        });

        this.pool.on('error', (err) => {
          this.logger.error('Postgres todo service pool error', err);
        });

    } catch (error) {
      this.logger.error('Error creating PostgreSQL todo service connection pool:', error);
    }
  }

  async onModuleInit() {
    console.log('Database connected');
  }

  async onModuleDestroy() {
    await this.pool.end();
    console.log('Database connection closed');
  }


  async findAllTodos(): Promise<TodoDto[]> {
    const queryText = `SELECT * FROM todos;`;
    try {
      const queryResult = await this.pool.query(queryText);
      // console.log(queryResult);
      
      const result: TodoDto[] = queryResult.rows;
      console.log(result);
      
      return result;
    } catch (error) {
      console.error(`Error Todos-SQL Service findAllTodos: ${error}`);
      this.logger.log('warn', `Error Todos-SQL Service findAllTodos: ${error}`);
      throw new Error('Error Todos-SQL Service findAllTodos');
    }
  }

  async findOneTodo(id: number): Promise<TodoDto> {
    const queryText = `SELECT * FROM todos WHERE id = $1;`;
    const paramsToArray: [number] = [id];
    try {
      const queryResult = await this.pool.query(queryText, paramsToArray);
      console.log(queryResult);
      const result: TodoDto = queryResult.rows[0];
      return result;
    } catch (error) {
      console.error(`Error Todos-SQL Service findOneTodo: ${error}`);
      this.logger.log('warn', `Error Todos-SQL Service findOneTodo: ${error}`);
      throw new Error('Error Todos-SQL Service findOneTodo');
    }
  }

  async createOneTodo(todo: Partial<TodoDto>): Promise<TodoDto> {
    const queryText = `
      INSERT INTO todos (detail, is_completed)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const paramsToArray: [string, boolean] = [todo.detail, false];
    try {
      const queryResult = await this.pool.query(queryText, paramsToArray);
      console.log(queryResult);
      const result: TodoDto = queryResult.rows[0];
      return result;
    } catch (error) {
      console.error(`Error Todos-SQL Service createOneTodo: ${error}`);
      this.logger.log('warn', `Error Todos-SQL Service createOneTodo: ${error}`);
      throw new Error('Error Todos-SQL Service createOneTodo');
    }
  }

  async updateOneTodo(todo: Partial<TodoDto>): Promise<TodoDto> {
    const queryText = `UPDATE todos SET detail = $1, is_completed = $2, date_modified = NOW() WHERE id = $3 RETURNING *;`;
    const is_completed: boolean = todo.is_completed ? todo.is_completed : false;
    const paramsToArray: [string, boolean, number] = [todo.detail, is_completed, todo.id ];    
    try {
      const queryResult = await this.pool.query(queryText, paramsToArray);
      console.log(queryResult);
      const result: TodoDto = queryResult.rows[0];
      return result;
    } catch (error) {
      console.error(`Error Todos-SQL Service updateOneTodo: ${error}`);
      this.logger.log('warn', `Error Todos-SQL Service updateOneTodo: ${error}`);
      throw new Error('Error Todos-SQL Service updateOneTodo');
    }
  }

  async deleteOneTodo(id: number): Promise<TodoDto> {
    const queryText = `DELETE FROM todos WHERE id = $1 RETURNING *;`;
    const paramsToArray: [number] = [id];
    try {
      const queryResult = await this.pool.query(queryText, paramsToArray);
      console.log(queryResult);
      const result: TodoDto = queryResult.rows[0];
      return result;
    } catch (error) {
      console.error(`Error Todos-SQL Service deleteOneTodo: ${error}`);
      this.logger.log('warn', `Error Todos-SQL Service deleteOneTodo: ${error}`);
      throw new Error('Error Todos-SQL Service deleteOneTodo');
    }
  }

}
