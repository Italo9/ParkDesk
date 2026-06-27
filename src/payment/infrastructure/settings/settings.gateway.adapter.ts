import { Injectable } from '@nestjs/common';
import { SettingsGateway, SettingsView } from '../../domain/ports/settings-gateway';
import { GetSettingByCompanyIdUseCase } from '../../../company-setting/application/get-setting-by-company-id.usecase';

@Injectable()
export class SettingsGatewayAdapter implements SettingsGateway {
  constructor(private readonly getSetting: GetSettingByCompanyIdUseCase) {}

  async get(companyId: number): Promise<SettingsView | null> {
    const setting = await this.getSetting.execute(companyId);
    if (!setting) return null;
    return { autorecharge: setting.autorecharge, valueHour: setting.valueHour };
  }
}
