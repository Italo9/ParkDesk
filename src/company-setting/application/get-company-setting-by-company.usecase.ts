import { Inject, Injectable } from '@nestjs/common';
import { CompanySetting } from '../domain/company-setting';
import { COMPANY_SETTING_REPOSITORY, CompanySettingRepository } from '../domain/ports/company-setting.repository';
import { REQUESTER_GATEWAY, RequesterGateway } from '../domain/ports/requester-gateway';
import { ensureRequesterAllowed } from './ensure-requester-allowed';

@Injectable()
export class GetCompanySettingByCompanyUseCase {
  constructor(
    @Inject(COMPANY_SETTING_REPOSITORY) private readonly settings: CompanySettingRepository,
    @Inject(REQUESTER_GATEWAY) private readonly requester: RequesterGateway,
  ) {}

  async execute(companyId: number, token: string): Promise<CompanySetting | null> {
    await ensureRequesterAllowed(this.requester, companyId, token);
    return this.settings.findByCompanyId(companyId);
  }
}
