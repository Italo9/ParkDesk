import { Company } from '../company';

export const COMPANY_REPOSITORY = Symbol('COMPANY_REPOSITORY');

export interface CreateCompanyData {
  name: string;
  cnpj: string;
  active: boolean;
  peopleForContact?: string;
  phone?: string;
  email?: string;
  matrizId?: number;
}

export interface UpdateCompanyData {
  name?: string;
  cnpj?: string;
  active?: boolean;
  peopleForContact?: string;
  phone?: string;
  email?: string;
}

export interface CompanyRepository {
  findByEmail(email: string): Promise<Company | null>;
  findByCnpj(cnpj: string): Promise<Company | null>;
  findById(id: number): Promise<Company | null>;
  findByIdWithUsers(id: number): Promise<Company | null>;
  findAll(): Promise<Company[]>;
  findAllByIdWithUsers(id: number): Promise<Company[]>;
  create(data: CreateCompanyData): Promise<Company>;
  update(id: number, patch: UpdateCompanyData): Promise<void>;
  deleteById(id: number): Promise<void>;
  findRootCompanyIdByUser(userId: string): Promise<number>;
  associateUser(userId: string, companyId: number): Promise<void>;
}
