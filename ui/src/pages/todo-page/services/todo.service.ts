import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from '../types/todo.types';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  // private readonly baseUrl = 'http://localhost:3003/todo'; // Update this to match your API URL
  // // private readonly baseUrl = 'http://localhost:9090/todo'; // Update this to match your API URL
  protected readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}


  // Get all todos
  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.baseUrl);
  }

  // Get a single todo by ID
  getTodoById(id: number): Observable<Todo> {
    return this.http.get<Todo>(`${this.baseUrl}/${id}`);
  }

  // Create a new todo
  createTodo(todo: Partial<Todo>): Observable<Todo> {
    console.log('create todo');
    console.log(todo);
    
    
    return this.http.post<Todo>(this.baseUrl, todo);
  }

  // Update an existing todo
  updateTodo(id: number, todo: Partial<Todo>): Observable<Todo> {
    return this.http.patch<Todo>(`${this.baseUrl}/${id}`, todo);
  }

  // Delete a todo
  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
