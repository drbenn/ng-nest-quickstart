import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { TodoDto, CreateTodoDto } from '@common-types';


@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private readonly baseUrl = environment.apiUrl + '/todo';

  constructor(private http: HttpClient) {}

  public getTodos(): Observable<TodoDto[]> {
    return this.http.get<TodoDto[]>(this.baseUrl);
  }

  public getTodoById(id: number): Observable<TodoDto> {
    return this.http.get<TodoDto>(`${this.baseUrl}/${id}`);
  }

  public createTodo(todo: CreateTodoDto): Observable<TodoDto> {
    return this.http.post<TodoDto>(this.baseUrl, todo);
  }

  public updateTodo(id: number, todo: Partial<TodoDto>): Observable<TodoDto> {
    return this.http.patch<TodoDto>(`${this.baseUrl}/${id}`, todo);
  }

  public deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
