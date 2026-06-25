export const REQUESTER_GATEWAY = Symbol('COMPANY_SETTING_REQUESTER_GATEWAY');

export interface RequesterCompany {
  id: number;
}

export interface RequesterInfo {
  type: string;
  companies: RequesterCompany[];
}

export interface RequesterGateway {
  getByToken(token: string): Promise<RequesterInfo>;
}
