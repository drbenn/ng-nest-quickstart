import { Inject, Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TodoDto } from '@common-types';
import { SqlTodoService } from './sql-todo/sql-todo.service';

@Injectable()
export class TodoService {
  constructor(
    private readonly sqlTodoService: SqlTodoService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  findAll(): Promise<TodoDto[]> {
    try {
      return this.sqlTodoService.findAllTodos();
    } catch (error: unknown) {
      this.logger.log('error', `Error finding all todos: ${error}`);
    }
  }

  findOne(id: number): Promise<TodoDto> {
    try {
      return this.sqlTodoService.findOneTodo(id);
    } catch (error: unknown) {
      this.logger.log('error', `Error finding one todo: ${error}`);
    }
  }

  create(todo: Partial<TodoDto>): Promise<TodoDto> {
    try {
      return this.sqlTodoService.createOneTodo(todo);
    } catch (error: unknown) {
      this.logger.log('error', `Error creating one todo: ${error}`);
    }
  }

  async update(id: number, todo: Partial<TodoDto>): Promise<TodoDto> {
    try {
      return this.sqlTodoService.updateOneTodo(todo);
    } catch (error: unknown) {
      this.logger.log('error', `Error updating one todo: ${error}`);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.sqlTodoService.deleteOneTodo(id);
    } catch (error: unknown) {
      this.logger.log('error', `Error removing one todo: ${error}`);
    }
  }

}
