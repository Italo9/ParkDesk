import { ApiKey } from '../../domain/api-key';
import { ApiKey as ApiKeyOrm } from '../../entities/api-key.entity';

export class ApiKeyMapper {
  static toDomain(row: ApiKeyOrm): ApiKey {
    return new ApiKey(
      row.id,
      row.apiKey,
      row.name,
      row.description,
      row.company?.id ?? null,
      row.user?.id ?? null,
      row.expirationDate ?? null,
      row.isActive,
    );
  }
}
