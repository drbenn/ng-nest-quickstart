import { Test, TestingModule } from '@nestjs/testing';
import { SqlTodoService } from './sql-todo.service';

describe('SqlTodoService', () => {
  let service: SqlTodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SqlTodoService],
    }).compile();

    service = module.get<SqlTodoService>(SqlTodoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
