import { Inject, Injectable } from '@nestjs/common';
import { CompanyNotFound, InvalidExpirationDate } from '../domain/api-key';
import { API_KEY_REPOSITORY, ApiKeyRepository } from '../domain/ports/api-key.repository';
import { COMPANY_GATEWAY, CompanyGateway } from '../domain/ports/company-gateway';
import { API_KEY_CIPHER, ApiKeyCipher } from '../domain/ports/api-key-cipher';
import { CreateApiKeyRequestDto } from '../dto/create-api-key-request.dto';

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

@Injectable()
export class CreateApiKeyUseCase {
  constructor(
    @Inject(API_KEY_REPOSITORY) private readonly apiKeys: ApiKeyRepository,
    @Inject(COMPANY_GATEWAY) private readonly companies: CompanyGateway,
    @Inject(API_KEY_CIPHER) private readonly cipher: ApiKeyCipher,
  ) {}

  async execute(
    dto: CreateApiKeyRequestDto,
    userId: string,
    companyId: number,
  ): Promise<{ encryptedApiKey: string; expirationDate: Date }> {
    const exists = await this.companies.exists(companyId);
    if (!exists) throw new CompanyNotFound();

    const finalExpirationDate = dto.expirationDate
      ? new Date(dto.expirationDate)
      : new Date(Date.now() + THIRTY_DAYS_MS);
    if (isNaN(finalExpirationDate.getTime())) throw new InvalidExpirationDate();

    const { encryptedApiKey } = this.cipher.generateApiKey(finalExpirationDate);

    await this.apiKeys.create({
      apiKey: encryptedApiKey,
      name: dto.name,
      description: dto.description,
      companyId,
      userId,
      expirationDate: finalExpirationDate,
      isActive: dto.isActive,
    });

    return { encryptedApiKey, expirationDate: finalExpirationDate };
  }
}
