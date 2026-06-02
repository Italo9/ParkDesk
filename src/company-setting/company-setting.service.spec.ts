import { Test, TestingModule } from '@nestjs/testing';
import { CompanySettingService } from './company-setting.service';

describe('CompanySettingService', () => {
  let service: CompanySettingService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ providers: [CompanySettingService] }).compile();
    service = module.get<CompanySettingService>(CompanySettingService);
  });
  it('should be defined', () => { expect(service).toBeDefined(); });
});
