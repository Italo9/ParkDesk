export const COMPANY_GATEWAY = Symbol('COMPANY_SETTING_COMPANY_GATEWAY');

export interface CompanyGateway {
  exists(companyId: number): Promise<boolean>;
}
