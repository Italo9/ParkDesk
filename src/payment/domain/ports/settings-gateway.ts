export const SETTINGS_GATEWAY = Symbol('PAYMENT_SETTINGS_GATEWAY');

export interface SettingsView {
  autorecharge: boolean;
  valueHour: number;
}

export interface SettingsGateway {
  get(companyId: number): Promise<SettingsView | null>;
}
