import { Test, TestingModule } from '@nestjs/testing';
import { UploadcareService } from './uploadcare.service';

describe('UploadcareService', () => {
  let service: UploadcareService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadcareService],
    }).compile();

    service = module.get<UploadcareService>(UploadcareService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
