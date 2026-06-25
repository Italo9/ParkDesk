import { Inject, Injectable } from '@nestjs/common';
import { ApiKeyNotFound } from '../domain/api-key';
import { API_KEY_REPOSITORY, ApiKeyRepository } from '../domain/ports/api-key.repository';

@Injectable()
export class DisableApiKeyUseCase {
  constructor(@Inject(API_KEY_REPOSITORY) private readonly apiKeys: ApiKeyRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.apiKeys.findById(Number(id));
    if (!existing) throw new ApiKeyNotFound();
    await this.apiKeys.setActive(Number(id), false);
  }
}
