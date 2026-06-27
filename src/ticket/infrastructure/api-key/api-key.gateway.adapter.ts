import { Injectable } from '@nestjs/common';
import { ApiKeyGateway } from '../../domain/ports/api-key-gateway';
import { FindApiKeyUseCase } from '../../../api_key/application/find-api-key.usecase';

@Injectable()
export class ApiKeyGatewayAdapter implements ApiKeyGateway {
  constructor(private readonly findApiKey: FindApiKeyUseCase) {}

  async companyIdFor(apiKey: string): Promise<number | null> {
    const found = await this.findApiKey.execute(apiKey);
    if (!found || found.companyId == null) return null;
    return found.companyId;
  }
}
