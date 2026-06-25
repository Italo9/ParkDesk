import { Inject, Injectable } from '@nestjs/common';
import { ApiKey } from '../domain/api-key';
import { API_KEY_REPOSITORY, ApiKeyRepository } from '../domain/ports/api-key.repository';

@Injectable()
export class FindApiKeyUseCase {
  constructor(@Inject(API_KEY_REPOSITORY) private readonly apiKeys: ApiKeyRepository) {}

  async execute(apiKey: string): Promise<ApiKey | null> {
    const cleaned = apiKey.replace('Bearer ', '');
    const found = await this.apiKeys.findActiveByValue(cleaned);
    if (!found) return null;
    if (found.isExpired()) return null;
    return found;
  }
}
