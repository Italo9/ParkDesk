import { Injectable } from '@nestjs/common';
import { SettingsGateway } from '../../domain/ports/settings-gateway';
import { SettingsView } from '../../domain/pre-checkout';
import { GetSettingByCompanyIdUseCase } from '../../../company-setting/application/get-setting-by-company-id.usecase';

@Injectable()
export class SettingsGatewayAdapter implements SettingsGateway {
  constructor(private readonly getSetting: GetSettingByCompanyIdUseCase) {}

  async getByCompanyId(companyId: number): Promise<SettingsView | null> {
    const setting = await this.getSetting.execute(companyId);
    if (!setting) return null;
    return {
      valueHour: setting.valueHour,
      valueFractionHour: setting.valueFractionHour,
    };
  }
}
