import { Test, TestingModule } from '@nestjs/testing';
import { CheckerController } from './checker.controller';

describe('CheckerController', () => {
  let controller: CheckerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CheckerController],
    }).compile();

    controller = module.get<CheckerController>(CheckerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
