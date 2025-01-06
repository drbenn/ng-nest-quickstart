import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TodoService } from './services/todo.service';
import { Todo } from './types/todo.types';

@Component({
  selector: 'todo-page',
  imports: [CommonModule, FormsModule, ButtonModule],
  providers: [TodoService],
  templateUrl: './todo-page.component.html',
  styleUrl: './todo-page.component.scss'
})
export class TodoPageComponent implements OnInit {
  protected todos: Todo[] = [];
  protected isUpdateMode: boolean = false;
  protected storedUpdatedTodo: Todo | undefined;
  protected todoText: string = '';
  
  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    console.log('TODO COMP INIT');
    
    this.todoService.getTodos().subscribe((todos: Todo[]) => {
      this.todos = todos;
      console.log(todos);
      
    })
  }

  protected addLorem20(): void {
    this.todoText = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui rem eligendi corrupti delectus quis voluptatibus inventore quam distinctio labore quae?'
  }

  protected submitTodo(): void {
    const newTodo: Partial<Todo> = { title: this.todoText, isCompleted: false};
    this.todoService.createTodo(newTodo).subscribe({
      next: (r: Todo) => {
        this.todos.push(r);
      },
      error: (err: any) => {
        console.error(err);
      }
    });
    this.todoText = '';
  }

  loadTodos(): void {
    this.todoService.getTodos().subscribe((data) => {
      this.todos = data;
    });
  }

  addTodo(): void {
    if (!this.todoText.trim()) return;

    const newTodo: Partial<Todo> = {
      title: this.todoText,
      isCompleted: false,
    };
    console.log(newTodo);
    

    this.todoService.createTodo(newTodo).subscribe((todo) => {
      this.todos.push(todo);
      this.todoText = '';
    });
  }

  toggleCompletion(todo: Todo): void {
    const updatedTodo = { ...todo, isCompleted: !todo.isCompleted };
    this.todoService.updateTodo(todo.id!, updatedTodo).subscribe((updated) => {
      todo.isCompleted = updated.isCompleted;
    });
  }

  deleteTodo(id: number): void {
    this.todoService.deleteTodo(id).subscribe(() => {
      this.todos = this.todos.filter((todo) => todo.id !== id);
    });
  };


  switchToUpdateMode(todo: Todo) {
    this.isUpdateMode = true;
    this.storedUpdatedTodo = todo;
    this.todoText = todo.title;
  }

  updateTodo(): void {
    if (this.storedUpdatedTodo && this.storedUpdatedTodo.id) {
      this.storedUpdatedTodo.title = this.todoText;
      this.todoService.updateTodo(this.storedUpdatedTodo.id, this.storedUpdatedTodo).subscribe((updatedTodo: Todo) => {
        const updateIndex: number = this.todos.findIndex((existingTodo: Todo) => existingTodo.id === updatedTodo.id);
        this.todos[updateIndex] = updatedTodo;
      });
      this.isUpdateMode = false;
      this.storedUpdatedTodo = undefined;
      this.todoText = '';
    }
  }
}
