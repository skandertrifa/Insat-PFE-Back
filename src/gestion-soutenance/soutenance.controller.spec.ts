import { Test, TestingModule } from '@nestjs/testing';
import { SoutenanceController } from './soutenance.controller';
import { SoutenanceService } from './soutenance.service';

describe('SoutenanceController', () => {
  let controller: SoutenanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SoutenanceController],
      providers: [SoutenanceService],
    }).compile();

    controller = module.get<SoutenanceController>(SoutenanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
