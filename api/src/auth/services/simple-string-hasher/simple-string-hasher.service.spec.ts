import { Test, TestingModule } from '@nestjs/testing';
import { SimpleStringHasherService } from './simple-string-hasher.service';

describe('SimpleStringHasherService', () => {
  let service: SimpleStringHasherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SimpleStringHasherService],
    }).compile();

    service = module.get<SimpleStringHasherService>(SimpleStringHasherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
