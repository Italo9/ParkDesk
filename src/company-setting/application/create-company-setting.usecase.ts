import { Inject, Injectable } from '@nestjs/common';
import { CompanySetting, CompanySettingAlreadyExists, GatewayConfig } from '../domain/company-setting';
import { COMPANY_SETTING_REPOSITORY, CompanySettingRepository } from '../domain/ports/company-setting.repository';
import { REQUESTER_GATEWAY, RequesterGateway } from '../domain/ports/requester-gateway';
import { CreateCompanySettingDto } from '../dto/create-company-setting.dto';
import { ensureRequesterAllowed } from './ensure-requester-allowed';

@Injectable()
export class CreateCompanySettingUseCase {
  constructor(
    @Inject(COMPANY_SETTING_REPOSITORY) private readonly settings: CompanySettingRepository,
    @Inject(REQUESTER_GATEWAY) private readonly requester: RequesterGateway,
  ) {}

  async execute(dto: CreateCompanySettingDto, token: string): Promise<CompanySetting> {
    const existing = await this.settings.findByCompanyId(dto.companyId);
    if (existing) throw new CompanySettingAlreadyExists();
    await ensureRequesterAllowed(this.requester, dto.companyId, token);
    return this.settings.create({
      companyId: dto.companyId,
      valueHour: dto.ValueHour,
      valueFractionHour: dto.ValueFractionHour,
      autorecharge: dto.autorecharge,
      timeTolerance: `${dto.timeTolerance}:00`,
      pixExpirationTime: dto.pixExpirationTime,
      gateway: dto.gateway as GatewayConfig,
    });
  }
}
