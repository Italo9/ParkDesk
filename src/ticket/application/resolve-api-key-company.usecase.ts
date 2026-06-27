import { Inject, Injectable } from '@nestjs/common';
import { ApiKeyCompanyMissing } from '../domain/ticket';
import { API_KEY_GATEWAY, ApiKeyGateway } from '../domain/ports/api-key-gateway';

@Injectable()
export class ResolveApiKeyCompanyUseCase {
  constructor(@Inject(API_KEY_GATEWAY) private readonly apiKeys: ApiKeyGateway) {}

  async execute(apiKey?: string): Promise<number | null> {
    if (!apiKey) return null;
    const companyId = await this.apiKeys.companyIdFor(apiKey);
    if (companyId == null) throw new ApiKeyCompanyMissing();
    return companyId;
  }
}
