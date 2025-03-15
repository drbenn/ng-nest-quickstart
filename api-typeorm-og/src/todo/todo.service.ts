import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  findAll(): Promise<Todo[]> {
    try {
      return this.todoRepository.find();
    } catch (error: unknown) {
      this.logger.log('error', `Error finding all todos: ${error}`);
    }
  }

  findOne(id: number): Promise<Todo> {
    try {
      return this.todoRepository.findOne({ where: { id } });
    } catch (error: unknown) {
      this.logger.log('error', `Error finding one todo: ${error}`);
    }
  }

  create(todo: Partial<Todo>): Promise<Todo> {
    try {
      const newTodo = this.todoRepository.create(todo);
      return this.todoRepository.save(newTodo);
    } catch (error: unknown) {
      this.logger.log('error', `Error creating one todo: ${error}`);
    }
  }

  async update(id: number, todo: Partial<Todo>): Promise<Todo> {
    try {
      await this.todoRepository.update(id, todo);
      return this.todoRepository.findOne({ where: { id } });
    } catch (error: unknown) {
      this.logger.log('error', `Error updating one todo: ${error}`);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.todoRepository.delete(id);
    } catch (error: unknown) {
      this.logger.log('error', `Error removing one todo: ${error}`);
    }
  }

}
