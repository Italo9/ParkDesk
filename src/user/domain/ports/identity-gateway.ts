export const IDENTITY_GATEWAY = Symbol('USER_IDENTITY_GATEWAY');

export interface CreateIdentityUser {
  name: string;
  lastName: string;
  email: string;
  password: string;
  type: string;
  companyId: number;
}

export interface IdentityGateway {
  createUser(input: CreateIdentityUser): Promise<void>;
  deleteUser(id: string): Promise<void>;
  getEmailByToken(token: string): Promise<string>;
}
