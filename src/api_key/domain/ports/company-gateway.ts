export const COMPANY_GATEWAY = Symbol('API_KEY_COMPANY_GATEWAY');

export interface CompanyGateway {
  exists(companyId: number): Promise<boolean>;
}
