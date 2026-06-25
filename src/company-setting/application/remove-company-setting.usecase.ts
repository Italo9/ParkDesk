import { Inject, Injectable } from '@nestjs/common';
import {
  CompanyNotFound,
  CompanySettingNotFound,
  OperationNotAllowed,
} from '../domain/company-setting';
import { COMPANY_SETTING_REPOSITORY, CompanySettingRepository } from '../domain/ports/company-setting.repository';
import { COMPANY_GATEWAY, CompanyGateway } from '../domain/ports/company-gateway';
import { REQUESTER_GATEWAY, RequesterGateway } from '../domain/ports/requester-gateway';

@Injectable()
export class RemoveCompanySettingUseCase {
  constructor(
    @Inject(COMPANY_SETTING_REPOSITORY) private readonly settings: CompanySettingRepository,
    @Inject(COMPANY_GATEWAY) private readonly companies: CompanyGateway,
    @Inject(REQUESTER_GATEWAY) private readonly requester: RequesterGateway,
  ) {}

  async execute(companyId: number, token: string): Promise<{ message: string }> {
    const existing = await this.settings.findByCompanyId(companyId);
    if (!existing) throw new CompanySettingNotFound();

    const requester = await this.requester.getByToken(token);
    const companyExists = await this.companies.exists(companyId);
    if (!companyExists) throw new CompanyNotFound();

    if (requester.type.toLowerCase() === 'admin' || requester.companies.some((c) => c.id === companyId)) {
      void this.settings.delete(existing.id as number);
      return { message: 'Configuracao da empresa removida com sucesso' };
    }

    throw new OperationNotAllowed('Voce nao tem permissao para atualizar esta empresa');
  }
}
