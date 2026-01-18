import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationAccessController } from './application-access.controller';

describe('ApplicationAccessController', () => {
  let controller: ApplicationAccessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicationAccessController],
    }).compile();

    controller = module.get<ApplicationAccessController>(ApplicationAccessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
