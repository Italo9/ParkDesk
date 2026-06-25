import { Inject, Injectable } from '@nestjs/common';
import { API_KEY_REPOSITORY, ApiKeyRepository } from '../domain/ports/api-key.repository';
import { REQUESTER_GATEWAY, RequesterGateway } from '../domain/ports/requester-gateway';

export interface MaskedApiKey {
  id: number;
  name: string;
  description: string;
  apiKey: string;
  isActive: boolean;
  expirationDate: Date | null;
}

@Injectable()
export class FindAllByCompanyUseCase {
  constructor(
    @Inject(API_KEY_REPOSITORY) private readonly apiKeys: ApiKeyRepository,
    @Inject(REQUESTER_GATEWAY) private readonly requester: RequesterGateway,
  ) {}

  async execute(token: string): Promise<MaskedApiKey[]> {
    const requester = await this.requester.getByToken(token);
    const companyIds = requester.companies.map((c) => c.id);
    const keys = await this.apiKeys.findActiveByCompany(companyIds);
    return keys.map((key) => ({
      id: key.id as number,
      name: key.name,
      description: key.description,
      apiKey: key.apiKey.slice(0, 5) + '********' + key.apiKey.slice(-5),
      isActive: key.isActive,
      expirationDate: key.expirationDate,
    }));
  }
}
