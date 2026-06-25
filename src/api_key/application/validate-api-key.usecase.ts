import { Inject, Injectable } from '@nestjs/common';
import { API_KEY_REPOSITORY, ApiKeyRepository } from '../domain/ports/api-key.repository';

@Injectable()
export class ValidateApiKeyUseCase {
  constructor(@Inject(API_KEY_REPOSITORY) private readonly apiKeys: ApiKeyRepository) {}

  execute(apiKey: string): Promise<boolean> {
    return this.apiKeys.existsByValue(apiKey);
  }
}
