import { Injectable } from '@nestjs/common';
import { SqlTodoService } from './todo/sql-todo/sql-todo.service';

@Injectable()
export class AppService {

  constructor(private sqlTodoService: SqlTodoService) {

  }
  getHello(): string {
    this.sqlTodoService.createOneTodo({detail: 'I HATE DEPLOYING', is_completed: false})
    return `Hello World! ${process.env.NODE_ENV}   ::::::   
    
    POSTGRES_HOST: ${process.env.POSTGRES_HOST}   ::::::  

    POSTGRES_PORT: ${process.env.POSTGRES_PORT}   ::::::  

    POSTGRES_USER: ${process.env.POSTGRES_USER}   ::::::  

    POSTGRES_PASSWORD: ${process.env.POSTGRES_PASSWORD}   ::::::  

    POSTGRES_DB: ${process.env.POSTGRES_DB}   ::::::  
    `;
  }
}
