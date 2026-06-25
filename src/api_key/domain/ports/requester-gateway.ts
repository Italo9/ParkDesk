export const REQUESTER_GATEWAY = Symbol('API_KEY_REQUESTER_GATEWAY');

export interface RequesterCompany {
  id: number;
}

export interface RequesterInfo {
  companies: RequesterCompany[];
}

export interface RequesterGateway {
  getByToken(token: string): Promise<RequesterInfo>;
}
