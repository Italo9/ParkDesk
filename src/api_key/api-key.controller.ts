import { Controller, Post, Body, Get, Param, Delete, BadRequestException, UseGuards, Req } from '@nestjs/common';
import { ApiKeyService } from './api-key.service';
import { AuthUseCase } from '../auth/use-cases/auth.use-case';
import { CreateApiKeyRequestDto } from './dto/create-api-key-request.dto';
import { CreateApiKeyResponseDto } from './dto/create-api-key-response.dto';
import { AuthGuard, AuthRequest } from '../auth/guards/auth.guard';
import { checkPermission } from '@/utils/check-permission';
import { User } from '@/user/entities/user.entity';

@Controller('api-keys')
export class ApiKeyController {
  constructor(
    private readonly apiKeyService: ApiKeyService,
    private readonly authUseCase: AuthUseCase,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async createApiKey(@Req() request: AuthRequest, @Body() createApiKeyRequestDto: CreateApiKeyRequestDto): Promise<CreateApiKeyResponseDto> {
    const user: User = request.user as User;
    const companies = request.companies;
    if (!companies) throw new BadRequestException('Empresas não encontradas na requisição.');
    checkPermission(user, 'createApiKey', companies);
    const { encryptedApiKey, expirationDate } = await this.apiKeyService.createApiKey(createApiKeyRequestDto, user, companies, request.headers.authorization as string);
    return new CreateApiKeyResponseDto(encryptedApiKey, expirationDate);
  }

  @Get()
  @UseGuards(AuthGuard)
  async listApiKeys(@Req() request: AuthRequest): Promise<any> {
    return this.apiKeyService.findAllByCompany(request.headers.authorization as string);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async disableApiKey(@Param('id') id: string, @Req() request: AuthRequest): Promise<{ message: string }> {
    const user: User = request.user as User;
    checkPermission(user, 'disableApiKeyById', request.companies);
    await this.apiKeyService.disableApiKeyById(id);
    return { message: 'API Key desativada com sucesso.' };
  }
}
