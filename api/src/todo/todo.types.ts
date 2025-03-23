// import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// @Entity("todos") // specifically name table 'todos' instead of default of class 'Todo'
// export class Todo {
  // @PrimaryGeneratedColumn()
export interface Todo {
  id: number;
  detail: string;
  is_completed: boolean;
  date_created: Date;
  date_modified: Date;
}