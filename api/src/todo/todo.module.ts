import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { SqlTodoModule } from './sql-todo/sql-todo.module';

@Module({
  providers: [TodoService],
  controllers: [TodoController],
  imports: [SqlTodoModule]
})
export class TodoModule {}
