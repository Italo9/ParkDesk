import { Inject, Injectable } from '@nestjs/common';
import {
  CompanyNotFound,
  CompanySetting,
  CompanySettingNotFound,
  GatewayConfig,
  OperationNotAllowed,
} from '../domain/company-setting';
import { COMPANY_SETTING_REPOSITORY, CompanySettingRepository } from '../domain/ports/company-setting.repository';
import { COMPANY_GATEWAY, CompanyGateway } from '../domain/ports/company-gateway';
import { REQUESTER_GATEWAY, RequesterGateway } from '../domain/ports/requester-gateway';
import { UpdateCompanySettingDto } from '../dto/update-company-setting.dto';

@Injectable()
export class UpdateCompanySettingUseCase {
  constructor(
    @Inject(COMPANY_SETTING_REPOSITORY) private readonly settings: CompanySettingRepository,
    @Inject(COMPANY_GATEWAY) private readonly companies: CompanyGateway,
    @Inject(REQUESTER_GATEWAY) private readonly requester: RequesterGateway,
  ) {}

  async execute(
    companyId: number,
    dto: UpdateCompanySettingDto,
    token: string,
  ): Promise<CompanySetting | null> {
    const existing = await this.settings.findByCompanyId(companyId);
    if (!existing) throw new CompanySettingNotFound();

    const requester = await this.requester.getByToken(token);
    const companyExists = await this.companies.exists(companyId);
    if (!companyExists) throw new CompanyNotFound();

    if (requester.type.toLowerCase() === 'admin' || requester.companies.some((c) => c.id === companyId)) {
      return this.settings.update(existing.id as number, {
        valueHour: dto.ValueHour,
        valueFractionHour: dto.ValueFractionHour,
        autorecharge: dto.autorecharge,
        pixExpirationTime: dto.pixExpirationTime,
        gateway: dto.gateway as GatewayConfig,
        timeTolerance: dto.timeTolerance ? `${dto.timeTolerance}:00` : existing.timeTolerance,
      });
    }

    throw new OperationNotAllowed('Voce nao tem permissao para atualizar esta empresa');
  }
}
