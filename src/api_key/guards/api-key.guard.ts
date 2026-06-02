import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ApiKeyService } from '../api-key.service';
import { UserService } from '../../user/user.service';
import { AuthRequest } from '../../auth/guards/auth.guard';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly apiKeyService: ApiKeyService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: AuthRequest = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'] as string;

    if (!authHeader) throw new UnauthorizedException('API Key não fornecida');

    const apiKey = authHeader.trim();
    const apiKeyEntity = await this.apiKeyService.findApiKey(apiKey);
    if (!apiKeyEntity) throw new UnauthorizedException('API Key inválida, inativa ou expirada');

    const isValid = await this.apiKeyService.validateApiKey(apiKey);
    if (!isValid) throw new UnauthorizedException('API Key inválida ou expirada');

    const user = await this.userService.findOneCheckout(apiKeyEntity.user.id);
    if (!user) throw new UnauthorizedException('Usuário associado à API Key não encontrado');

    request.user = user;
    request.companies = user.companies;
    return true;
  }
}
