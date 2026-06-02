import { Injectable, CanActivate, ExecutionContext, Inject, forwardRef } from '@nestjs/common';
import { ApiKeyService } from '../../api_key/api-key.service';
import { AuthUseCase } from '../../auth/use-cases/auth.use-case';

@Injectable()
export class ApiKeyOrAuthGuard implements CanActivate {
  constructor(
    private readonly apiKeyService: ApiKeyService,
    @Inject(forwardRef(() => AuthUseCase)) private readonly authUseCase: AuthUseCase,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader) return false;
    const tokenOrApiKey = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (await this.apiKeyService.validateApiKey(tokenOrApiKey)) return true;
    if (await this.authUseCase.validateToken(tokenOrApiKey)) return true;
    return false;
  }
}
