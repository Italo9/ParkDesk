import { SettingsView } from '../pre-checkout';

export const SETTINGS_GATEWAY = Symbol('PRE_CHECKOUT_SETTINGS_GATEWAY');

export interface SettingsGateway {
  getByCompanyId(companyId: number): Promise<SettingsView | null>;
}
