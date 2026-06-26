export const USER_GATEWAY = Symbol('COMPANY_USER_GATEWAY');

export interface RequesterInfo {
  type: string;
  companies: { id: number }[];
}

export interface CreatedUser {
  id: string | null;
}

export interface CreateUserInput {
  name: string;
  lastName: string;
  email: string;
  password: string;
  companyId: number;
  type: string;
}

export interface UserGateway {
  findTypeByEmail(email: string): Promise<{ type: string } | null>;
  create(input: CreateUserInput, token: string): Promise<CreatedUser>;
  remove(id: string, token: string): Promise<void>;
  getByToken(token: string): Promise<RequesterInfo>;
  deleteIdentity(emailOrId: string): Promise<void>;
  removeUsersByCompany(companyId: number): Promise<void>;
}
