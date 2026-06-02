import { Controller, Post, Body, UseGuards, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { AuthUseCase } from '../use-cases/auth.use-case';
import { AuthGuard } from '../guards/auth.guard';
import { SessionService } from '../session.service';
import { CompanyService } from '../../company/company.service';
import * as jwt from 'jsonwebtoken';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authUseCase: AuthUseCase,
    private readonly sessionService: SessionService,
    private readonly companyService: CompanyService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Realiza o login e retorna um token JWT' })
  @ApiBody({ schema: { type: 'object', properties: { email: { type: 'string' }, password: { type: 'string' } }, required: ['email', 'password'] } })
  @ApiResponse({ status: 200, description: 'Login bem-sucedido' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  @ApiResponse({ status: 404, description: 'Empresa não encontrada' })
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    const { accessToken, companyId } = await this.authUseCase.login(email, password);
    const existingSession = await this.sessionService.findByEmail(email);

    const decodedToken = jwt.decode(accessToken, { complete: true }) as { header: { kid: string }; payload: { exp: number } } | null;
    if (!decodedToken) throw new UnauthorizedException('Token inválido');

    const expirationDate = new Date(decodedToken.payload.exp * 1000);

    if (!companyId || !companyId[0] || !companyId[0].id) {
      throw new NotFoundException('ID da empresa não encontrado');
    }

    const companyEntity = await this.companyService.findOne(String(companyId[0].id));
    if (!companyEntity) throw new NotFoundException('Empresa não encontrada');

    if (existingSession) {
      if (existingSession.token !== accessToken) {
        await this.sessionService.updateStatus(String(existingSession.id), false);
        await this.sessionService.create({ email, token: accessToken, status: true, expiredAt: expirationDate, company: companyEntity });
      }
    } else {
      await this.sessionService.create({ email, token: accessToken, status: true, expiredAt: expirationDate, company: companyEntity });
    }

    return { accessToken, companyId };
  }

  @Post('validate')
  @UseGuards(AuthGuard)
  async validate(@Body() body: { token: string }) {
    const isValid = await this.authUseCase.validateToken(body.token);
    return { isValid };
  }
}
