export interface TodoDto {
  id: string,
  detail: string,
  is_completed: boolean,
  date_created: Date,
  date_modifed: Date,
}

export interface CreateTodoDto {
  detail: string,
}
