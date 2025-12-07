import { Test, TestingModule } from '@nestjs/testing';
import { UploadcareController } from './uploadcare.controller';

describe('UploadcareController', () => {
  let controller: UploadcareController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadcareController],
    }).compile();

    controller = module.get<UploadcareController>(UploadcareController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
