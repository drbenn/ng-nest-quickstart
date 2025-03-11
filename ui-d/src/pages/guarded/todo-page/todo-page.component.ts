import { Component } from '@angular/core';
import { TodoDto, CreateTodoDto } from '../../../types/todoDto.types';
import { TodoService } from './services/todo.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StandardPageWrapperComponent } from '../../../components/standard-page-wrapper/standard-page-wrapper.component';

@Component({
  selector: 'todo-page',
  imports: [CommonModule, FormsModule, StandardPageWrapperComponent],
  templateUrl: './todo-page.component.html',
  styleUrl: './todo-page.component.scss'
})
export class TodoPageComponent {
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
    const updatedTodo = { ...todo, isCompleted: !todo.isCompleted };
    this.todoService.updateTodo(todo.id!, updatedTodo).subscribe((updated) => {
      todo.isCompleted = updated.isCompleted;
    });
  }

  protected deleteTodo(id: number): void {
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
