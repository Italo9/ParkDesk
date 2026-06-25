import { Inject, Injectable } from '@nestjs/common';
import { ApiKey } from '../domain/api-key';
import { API_KEY_REPOSITORY, ApiKeyRepository } from '../domain/ports/api-key.repository';

@Injectable()
export class FindApiKeyByUserIdUseCase {
  constructor(@Inject(API_KEY_REPOSITORY) private readonly apiKeys: ApiKeyRepository) {}

  execute(userId: string): Promise<ApiKey | null> {
    return this.apiKeys.findByUserId(userId);
  }
}
