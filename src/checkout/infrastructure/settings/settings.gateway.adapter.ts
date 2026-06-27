import { Injectable } from '@nestjs/common';
import { SettingsGateway } from '../../domain/ports/settings-gateway';
import { GetSettingByCompanyIdUseCase } from '../../../company-setting/application/get-setting-by-company-id.usecase';

@Injectable()
export class SettingsGatewayAdapter implements SettingsGateway {
  constructor(private readonly getSetting: GetSettingByCompanyIdUseCase) {}

  async pixExpirationTime(companyId: number): Promise<number | null> {
    const setting = await this.getSetting.execute(companyId);
    return setting ? setting.pixExpirationTime ?? null : null;
  }
}
