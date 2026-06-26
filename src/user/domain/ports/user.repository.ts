import { User } from '../user';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface CreateUserData {
  name: string;
  lastName: string;
  email: string;
  password: string;
  type: string;
  companyId: number;
}

export interface UpdateUserData {
  name?: string;
  lastName?: string;
  email?: string;
  password?: string;
  type?: string;
}

export interface UserRepository {
  create(data: CreateUserData): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findAllByCompany(companyId: number | undefined): Promise<User[]>;
  update(id: string, patch: UpdateUserData): Promise<User | null>;
  remove(id: string): Promise<void>;
  removeOrphansByCompany(companyId: number): Promise<void>;
}
