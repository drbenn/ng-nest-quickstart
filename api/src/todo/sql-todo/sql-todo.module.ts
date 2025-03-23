import { Module } from '@nestjs/common';
import { SqlTodoService } from './sql-todo.service';

@Module({
  providers: [SqlTodoService],
  exports: [SqlTodoService]
})
export class SqlTodoModule {


  
}
