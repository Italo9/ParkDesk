import { RequesterGateway } from '../domain/ports/requester-gateway';
import { OperationNotAllowed } from '../domain/company-setting';

export async function ensureRequesterAllowed(
  requester: RequesterGateway,
  companyId: number,
  token: string,
): Promise<void> {
  const info = await requester.getByToken(token);
  if (info.type.toLowerCase() !== 'admin' && info.companies.some((c) => c.id === companyId)) {
    throw new OperationNotAllowed();
  }
}
