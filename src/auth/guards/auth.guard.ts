import { Injectable, CanActivate, ExecutionContext, Inject, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../ports/auth-service.interface';
import { Request } from 'express';
import { SessionService } from '../session.service';
import { FindByEmailUseCase } from '../../user/application/find-by-email.usecase';
import { User } from '../../user/entities/user.entity';
import { Company } from '../../company/entities/company.entity';

export interface AuthRequest extends Request {
  user?: User;
  companies?: Company[];
  companyId?: number;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('AuthService') private authService: AuthService,
    private readonly sessionService: SessionService,
    private readonly findByEmail: FindByEmailUseCase,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: AuthRequest = context.switchToHttp().getRequest<AuthRequest>();
    const authHeader: string = request.headers.authorization as string;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token não fornecido');
    }

    const token: string = authHeader.split(' ')[1];
    const isValid: boolean = await this.authService.validateToken(token);

    if (!isValid) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }

    const session = await this.sessionService.findByToken(token);
    if (!session) {
      throw new UnauthorizedException('Sessão não encontrada');
    }

    const user = await this.findByEmail.execute(session.email);
    if (!user) {
      throw new UnauthorizedException('Usuário logado não encontrado');
    }

    request.user = user as unknown as User;
    request.companies = (user.companies ?? []) as unknown as Company[];
    return true;
  }
}
