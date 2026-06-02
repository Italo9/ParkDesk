import { Test, TestingModule } from '@nestjs/testing';
import { CompanySettingController } from './company-setting.controller';
import { CompanySettingService } from './company-setting.service';

describe('CompanySettingController', () => {
  let controller: CompanySettingController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [CompanySettingController], providers: [CompanySettingService] }).compile();
    controller = module.get<CompanySettingController>(CompanySettingController);
  });
  it('should be defined', () => { expect(controller).toBeDefined(); });
});
