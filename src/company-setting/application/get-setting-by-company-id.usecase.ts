import { Inject, Injectable } from '@nestjs/common';
import { CompanySetting } from '../domain/company-setting';
import { COMPANY_SETTING_REPOSITORY, CompanySettingRepository } from '../domain/ports/company-setting.repository';

@Injectable()
export class GetSettingByCompanyIdUseCase {
  constructor(
    @Inject(COMPANY_SETTING_REPOSITORY) private readonly settings: CompanySettingRepository,
  ) {}

  execute(companyId: number): Promise<CompanySetting | null> {
    return this.settings.findByCompanyId(companyId);
  }
}
