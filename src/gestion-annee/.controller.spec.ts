import { Test, TestingModule } from '@nestjs/testing';
import { AnneeController } from './annee.controller';
import { AnneeService } from './annee.service';

describe('Controller', () => {
  let controller: AnneeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnneeController],
      providers: [AnneeService],
    }).compile();

    controller = module.get<AnneeController>(AnneeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
