import { Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
export declare class TodoService {
    private readonly todoRepository;
    private readonly logger;
    constructor(todoRepository: Repository<Todo>, logger: Logger);
    findAll(): Promise<Todo[]>;
    findOne(id: number): Promise<Todo>;
    create(todo: Partial<Todo>): Promise<Todo>;
    update(id: number, todo: Partial<Todo>): Promise<Todo>;
    remove(id: number): Promise<void>;
}
