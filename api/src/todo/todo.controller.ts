import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoDto } from '@common-types';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  findAll(): Promise<TodoDto[]> {
    return this.todoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<TodoDto> {
    return this.todoService.findOne(id);
  }

  @Post()
  create(@Body() todo: Partial<TodoDto>): Promise<TodoDto> {
    return this.todoService.create(todo);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() todo: Partial<TodoDto>): Promise<TodoDto> {
    return this.todoService.update(id, todo);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.todoService.remove(id);
  }
}
