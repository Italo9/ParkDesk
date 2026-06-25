import { Inject, Injectable } from '@nestjs/common';
import { ApiKey, ApiKeyNotFound } from '../domain/api-key';
import { API_KEY_REPOSITORY, ApiKeyRepository } from '../domain/ports/api-key.repository';
import { CreateApiKeyRequestDto } from '../dto/create-api-key-request.dto';

@Injectable()
export class UpdateApiKeyUseCase {
  constructor(@Inject(API_KEY_REPOSITORY) private readonly apiKeys: ApiKeyRepository) {}

  async execute(apiKey: string, dto: CreateApiKeyRequestDto): Promise<ApiKey> {
    const existing = await this.apiKeys.findByValue(apiKey);
    if (!existing) throw new ApiKeyNotFound();
    if (dto.expirationDate) {
      return this.apiKeys.updateExpiration(apiKey, new Date(dto.expirationDate));
    }
    return existing;
  }
}
