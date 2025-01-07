import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity("todos") // specifically name table 'todos' instead of default of class 'Todo'
export class Todo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  detail: string;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  date_created: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  date_modified: Date;
}