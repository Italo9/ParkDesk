import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { FindApiKeyUseCase } from '../application/find-api-key.usecase';
import { ValidateApiKeyUseCase } from '../application/validate-api-key.usecase';
import { UserService } from '../../user/user.service';
import { AuthRequest } from '../../auth/guards/auth.guard';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly findApiKey: FindApiKeyUseCase,
    private readonly validateApiKey: ValidateApiKeyUseCase,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: AuthRequest = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'] as string;

    if (!authHeader) throw new UnauthorizedException('API Key nao fornecida');

    const apiKey = authHeader.trim();
    const apiKeyEntity = await this.findApiKey.execute(apiKey);
    if (!apiKeyEntity) throw new UnauthorizedException('API Key invalida, inativa ou expirada');

    const isValid = await this.validateApiKey.execute(apiKey);
    if (!isValid) throw new UnauthorizedException('API Key invalida ou expirada');

    const user = await this.userService.findOneCheckout(apiKeyEntity.userId as string);
    if (!user) throw new UnauthorizedException('Usuario associado a API Key nao encontrado');

    request.user = user;
    request.companies = user.companies;
    return true;
  }
}
