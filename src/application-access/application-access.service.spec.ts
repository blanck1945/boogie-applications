import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationAccessService } from './application-access.service';

describe('ApplicationAccessService', () => {
  let service: ApplicationAccessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApplicationAccessService],
    }).compile();

    service = module.get<ApplicationAccessService>(ApplicationAccessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
