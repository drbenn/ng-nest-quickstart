export interface TodoDto {
  id: number;
  detail: string;
  is_completed: boolean;
  date_created: Date;
  date_modified: Date;
}

export interface CreateTodoDto {
  detail: string,
}