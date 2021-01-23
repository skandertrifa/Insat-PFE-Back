import { Test, TestingModule } from '@nestjs/testing';
import { SoutenanceService } from './soutenance.service';

describe('SoutenanceService', () => {
  let service: SoutenanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SoutenanceService],
    }).compile();

    service = module.get<SoutenanceService>(SoutenanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
