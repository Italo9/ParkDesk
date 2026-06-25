import { CompanySetting, GatewayConfig } from '../../domain/company-setting';
import { CompanySetting as CompanySettingOrm } from '../../entities/company-setting.entity';

export class CompanySettingMapper {
  static toDomain(row: CompanySettingOrm): CompanySetting {
    return new CompanySetting(
      row.id,
      row.company?.id ?? 0,
      row.ValueHour,
      row.ValueFractionHour,
      row.autorecharge,
      row.timeTolerance,
      row.pixExpirationTime,
      (row.gateway as GatewayConfig) ?? null,
    );
  }
}
