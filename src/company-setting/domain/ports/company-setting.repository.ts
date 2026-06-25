import { CompanySetting, GatewayConfig } from '../company-setting';

export const COMPANY_SETTING_REPOSITORY = Symbol('COMPANY_SETTING_REPOSITORY');

export interface CreateSettingData {
  companyId: number;
  valueHour: number;
  valueFractionHour: number;
  autorecharge: boolean;
  timeTolerance: string;
  pixExpirationTime: number;
  gateway?: GatewayConfig;
}

export interface SettingPatch {
  valueHour?: number;
  valueFractionHour?: number;
  autorecharge?: boolean;
  timeTolerance?: string;
  pixExpirationTime?: number;
  gateway?: GatewayConfig;
}

export interface CompanySettingRepository {
  create(data: CreateSettingData): Promise<CompanySetting>;
  findByCompanyId(companyId: number): Promise<CompanySetting | null>;
  update(id: number, patch: SettingPatch): Promise<CompanySetting | null>;
  delete(id: number): Promise<void>;
}
