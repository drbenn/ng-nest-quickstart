import { ChatMessageDbRowDto, MessageDataDto } from '@common-types/chat.dto';
import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Pool } from 'pg';

@Injectable()
export class SqlChatService implements OnModuleInit, OnModuleDestroy {
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
    // console.log('Database connected');
  }

  async onModuleDestroy() {
    await this.pool.end();
    // console.log('Database connection closed');
  }

  async getAllChatRooms(): Promise<any> {
    let queryText = `SELECT * FROM chat_rooms ORDER BY name ASC`;
    try {
      const queryResult = await this.pool.query(queryText);
      const result: any = queryResult.rows[0];
      return result;
    } catch (error) {
      console.error(`Error Chat-SQL Service getAllChatRooms: ${error}`);
      this.logger.log('warn', `Error Chat-SQL Service getAllChatRooms: ${error}`);
      throw new Error('Error Chat-SQL Service getAllChatRooms');
    }
  }

  async saveMessage(
    roomId: string,
    senderId: string | null,
    messageData: MessageDataDto,
  ): Promise<ChatMessageDbRowDto> {
    const queryText = `
      INSERT INTO chat_messages (room_id, sender_id, message_data)
      VALUES ($1, $2, $3)
      RETURNING id, room_id, sender_id, created_at, message_data;
    `;
    // Use parameterized query!
    const paramsToArray = [roomId, senderId, messageData];

    try {
      const queryResult = await this.pool.query(queryText, paramsToArray);
      const result: ChatMessageDbRowDto = queryResult.rows[0];
      return result;
    } catch (error) {
      console.error(`Error Chat-SQL Service saveMessage: ${error}`);
      this.logger.log('warn', `Error Chat-SQL Service saveMessage: ${error}`);
      throw new Error('Error Chat-SQL Service saveMessage');
    }
  }

  async getMessageHistory(
      roomId: number,
      limit: number,
      beforeTimestamp?: string // ISO timestamp string
    ): Promise<ChatMessageDbRowDto[]> {

    // Basic authorization check should happen before calling this ideally
    // e.g., check if the requesting user is part of roomId

    let queryText = `
        SELECT id, room_id, sender_id, created_at, message_data
        FROM chat_messages
        WHERE room_id = $1
    `;

    const paramsToArray: any[] = [roomId];

    let paramIndex = 2; // Start parameter index at $2

    if (beforeTimestamp) {
      queryText += ` AND created_at < $${paramIndex}`;
        paramsToArray.push(new Date(beforeTimestamp)); // Convert ISO string to Date object
        paramIndex++;
    }

    queryText += ` ORDER BY created_at DESC LIMIT $${paramIndex};`;
    paramsToArray.push(limit);

    try {
      const queryResult = await this.pool.query(queryText, paramsToArray);
      const result: ChatMessageDbRowDto[] = queryResult.rows[0];
      return result;
    } catch (error) {
      console.error(`Error Chat-SQL Service getMessageHistory: ${error}`);
      this.logger.log('warn', `Error Chat-SQL Service getMessageHistory: ${error}`);
      throw new Error('Error Chat-SQL Service getMessageHistory');
    }
  }


  // async findAllTodos(): Promise<TodoDto[]> {
  //   const queryText = `SELECT * FROM todos;`;
  //   try {
  //     const queryResult = await this.pool.query(queryText);
  //     const result: TodoDto[] = queryResult.rows;
  //     return result;
  //   } catch (error) {
  //     console.error(`Error Todos-SQL Service findAllTodos: ${error}`);
  //     this.logger.log('warn', `Error Todos-SQL Service findAllTodos: ${error}`);
  //     throw new Error('Error Todos-SQL Service findAllTodos');
  //   }
  // }

  // async findOneTodo(id: number): Promise<TodoDto> {
  //   const queryText = `SELECT * FROM todos WHERE id = $1;`;
  //   const paramsToArray: [number] = [id];
  //   try {
  //     const queryResult = await this.pool.query(queryText, paramsToArray);
  //     const result: TodoDto = queryResult.rows[0];
  //     return result;
  //   } catch (error) {
  //     console.error(`Error Todos-SQL Service findOneTodo: ${error}`);
  //     this.logger.log('warn', `Error Todos-SQL Service findOneTodo: ${error}`);
  //     throw new Error('Error Todos-SQL Service findOneTodo');
  //   }
  // }

  // async createOneTodo(todo: Partial<TodoDto>): Promise<TodoDto> {
  //   const queryText = `
  //     INSERT INTO todos (detail, is_completed)
  //     VALUES ($1, $2)
  //     RETURNING *;
  //   `;
  //   const paramsToArray: [string, boolean] = [todo.detail, false];
  //   try {
  //     const queryResult = await this.pool.query(queryText, paramsToArray);
  //     const result: TodoDto = queryResult.rows[0];
  //     return result;
  //   } catch (error) {
  //     console.error(`Error Todos-SQL Service createOneTodo: ${error}`);
  //     this.logger.log('warn', `Error Todos-SQL Service createOneTodo: ${error}`);
  //     throw new Error('Error Todos-SQL Service createOneTodo');
  //   }
  // }

  // async updateOneTodo(todo: Partial<TodoDto>): Promise<TodoDto> {
  //   const queryText = `UPDATE todos SET detail = $1, is_completed = $2, date_modified = NOW() WHERE id = $3 RETURNING *;`;
  //   const is_completed: boolean = todo.is_completed ? todo.is_completed : false;
  //   const paramsToArray: [string, boolean, number] = [todo.detail, is_completed, todo.id ];    
  //   try {
  //     const queryResult = await this.pool.query(queryText, paramsToArray);
  //     const result: TodoDto = queryResult.rows[0];
  //     return result;
  //   } catch (error) {
  //     console.error(`Error Todos-SQL Service updateOneTodo: ${error}`);
  //     this.logger.log('warn', `Error Todos-SQL Service updateOneTodo: ${error}`);
  //     throw new Error('Error Todos-SQL Service updateOneTodo');
  //   }
  // }

  // async deleteOneTodo(id: number): Promise<TodoDto> {
  //   const queryText = `DELETE FROM todos WHERE id = $1 RETURNING *;`;
  //   const paramsToArray: [number] = [id];
  //   try {
  //     const queryResult = await this.pool.query(queryText, paramsToArray);
  //     const result: TodoDto = queryResult.rows[0];
  //     return result;
  //   } catch (error) {
  //     console.error(`Error Todos-SQL Service deleteOneTodo: ${error}`);
  //     this.logger.log('warn', `Error Todos-SQL Service deleteOneTodo: ${error}`);
  //     throw new Error('Error Todos-SQL Service deleteOneTodo');
  //   }
  // }

}
