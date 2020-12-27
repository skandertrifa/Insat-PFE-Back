import { Test, TestingModule } from '@nestjs/testing';
import { AnneeService } from './annee.service';

describe('Service', () => {
  let service: AnneeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnneeService],
    }).compile();

    service = module.get<AnneeService>(AnneeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
