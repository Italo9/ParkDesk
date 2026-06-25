import { Inject, Injectable } from '@nestjs/common';
import { COMPANY_SETTING_REPOSITORY, CompanySettingRepository } from '../domain/ports/company-setting.repository';

@Injectable()
export class IsAutoRechargeActiveUseCase {
  constructor(
    @Inject(COMPANY_SETTING_REPOSITORY) private readonly settings: CompanySettingRepository,
  ) {}

  async execute(companyId: number): Promise<boolean> {
    const setting = await this.settings.findByCompanyId(companyId);
    return setting ? setting.autorecharge : false;
  }
}
