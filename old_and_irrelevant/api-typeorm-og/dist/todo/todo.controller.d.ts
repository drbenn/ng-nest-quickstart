import { Todo } from './todo.entity';
import { TodoService } from './todo.service';
export declare class TodoController {
    private readonly todoService;
    constructor(todoService: TodoService);
    findAll(): Promise<Todo[]>;
    findOne(id: number): Promise<Todo>;
    create(todo: Partial<Todo>): Promise<Todo>;
    update(id: number, todo: Partial<Todo>): Promise<Todo>;
    remove(id: number): Promise<void>;
}
