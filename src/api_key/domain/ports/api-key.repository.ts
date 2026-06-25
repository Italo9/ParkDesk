import { ApiKey } from '../api-key';

export const API_KEY_REPOSITORY = Symbol('API_KEY_REPOSITORY');

export interface CreateApiKeyData {
  apiKey: string;
  name: string;
  description: string;
  companyId: number;
  userId: string;
  expirationDate: Date;
  isActive: boolean;
}

export interface ApiKeyRepository {
  create(data: CreateApiKeyData): Promise<ApiKey>;
  findActiveByValue(value: string): Promise<ApiKey | null>;
  findByValue(value: string): Promise<ApiKey | null>;
  existsByValue(value: string): Promise<boolean>;
  findById(id: number): Promise<ApiKey | null>;
  findByUserId(userId: string): Promise<ApiKey | null>;
  updateExpiration(value: string, expirationDate: Date): Promise<ApiKey>;
  setActive(id: number, isActive: boolean): Promise<void>;
  findActiveByCompany(companyIds: number[]): Promise<ApiKey[]>;
}
