import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TodoService } from './services/todo.service';
import { TooltipModule } from 'primeng/tooltip';
import { CreateTodoDto, TodoDto } from '../../../types/todoDto.types';
import { StandardPageWrapperComponent } from '../../../components/standard-page-wrapper/standard-page-wrapper.component';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'todo-page',
  imports: [CommonModule, FormsModule, ButtonModule, TooltipModule, DividerModule, StandardPageWrapperComponent],
  providers: [TodoService],
  templateUrl: './todo-page.component.html',
  styleUrl: './todo-page.component.scss'
})
export class TodoPageComponent implements OnInit {
  protected todos: TodoDto[] = [];
  protected isUpdateMode: boolean = false;
  protected storedUpdatedTodo: TodoDto | undefined;
  protected todoText: string = '';
  
  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.todoService.getTodos().subscribe((todos: TodoDto[]) => {
      this.todos = todos;
    })
  }

  protected addLorem20(): void {
    this.todoText = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui rem eligendi corrupti delectus quis voluptatibus inventore quam distinctio labore quae?'
  }

  protected submitTodo(): void {
    const newTodo: CreateTodoDto = { detail: this.todoText };
    this.todoService.createTodo(newTodo).subscribe({
      next: (todo: TodoDto) => {
        this.todos.push(todo);
      },
      error: (err: any) => {
        console.error(err);
      }
    });
    this.todoText = '';
  }

  private loadTodos(): void {
    this.todoService.getTodos().subscribe((data) => {
      this.todos = data;
    });
  }

  private addTodo(): void {
    if (!this.todoText.trim()) return;
    const newTodo: CreateTodoDto = {
      detail: this.todoText
    }; 
    this.todoService.createTodo(newTodo).subscribe((todo) => {
      this.todos.push(todo);
      this.todoText = '';
    });
  }

  private toggleCompletion(todo: TodoDto): void {
    const updatedTodo = { ...todo, isCompleted: !todo.is_completed };
    this.todoService.updateTodo(todo.id!, updatedTodo).subscribe((updated) => {
      todo.is_completed = updated.is_completed;
    });
  }

  protected deleteTodo(id: string): void {
    this.todoService.deleteTodo(id).subscribe(() => {
      this.todos = this.todos.filter((todo) => todo.id !== id);
    });
  };


  protected switchToUpdateMode(todo: TodoDto) {
    this.isUpdateMode = true;
    this.storedUpdatedTodo = todo;
    this.todoText = todo.detail;
  }

  protected updateTodo(): void {
    if (this.storedUpdatedTodo && this.storedUpdatedTodo.id) {
      this.storedUpdatedTodo.detail = this.todoText;
      this.todoService.updateTodo(this.storedUpdatedTodo.id, this.storedUpdatedTodo).subscribe((updatedTodo: TodoDto) => {
        const updateIndex: number = this.todos.findIndex((existingTodo: TodoDto) => existingTodo.id === updatedTodo.id);
        this.todos[updateIndex] = updatedTodo;
      });
      this.isUpdateMode = false;
      this.storedUpdatedTodo = undefined;
      this.todoText = '';
    }
  }
}
