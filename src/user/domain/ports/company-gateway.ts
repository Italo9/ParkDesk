export const COMPANY_GATEWAY = Symbol('USER_COMPANY_GATEWAY');

export interface CompanyGateway {
  exists(companyId: number): Promise<boolean>;
}
