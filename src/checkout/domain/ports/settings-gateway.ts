export const SETTINGS_GATEWAY = Symbol('CHECKOUT_SETTINGS_GATEWAY');

export interface SettingsGateway {
  pixExpirationTime(companyId: number): Promise<number | null>;
}
