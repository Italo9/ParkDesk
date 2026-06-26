import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  BadRequestException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard, AuthRequest } from '@/auth/guards/auth.guard';
import { checkPermission } from '@/utils/check-permission';
import { User } from '@/user/entities/user.entity';
import { CreateApiKeyRequestDto } from '../../dto/create-api-key-request.dto';
import { CreateApiKeyResponseDto } from '../../dto/create-api-key-response.dto';
import { CreateApiKeyUseCase } from '../../application/create-api-key.usecase';
import { FindAllByCompanyUseCase } from '../../application/find-all-by-company.usecase';
import { DisableApiKeyUseCase } from '../../application/disable-api-key.usecase';

@Controller('api-keys')
export class ApiKeyController {
  constructor(
    private readonly createApiKey: CreateApiKeyUseCase,
    private readonly findAllByCompany: FindAllByCompanyUseCase,
    private readonly disableApiKey: DisableApiKeyUseCase,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Req() request: AuthRequest,
    @Body() createApiKeyRequestDto: CreateApiKeyRequestDto,
  ): Promise<CreateApiKeyResponseDto> {
    const user = request.user as User;
    const companies = request.companies;
    if (!companies) throw new BadRequestException('Empresas nao encontradas na requisicao.');
    checkPermission(user, 'createApiKey', companies);
    const { encryptedApiKey, expirationDate } = await this.createApiKey.execute(
      createApiKeyRequestDto,
      user.id,
      companies[0].id,
    );
    return new CreateApiKeyResponseDto(encryptedApiKey, expirationDate);
  }

  @Get()
  @UseGuards(AuthGuard)
  async list(@Req() request: AuthRequest) {
    return this.findAllByCompany.execute(request.headers.authorization as string);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async disable(
    @Param('id') id: string,
    @Req() request: AuthRequest,
  ): Promise<{ message: string }> {
    const user = request.user as User;
    checkPermission(user, 'disableApiKeyById', request.companies);
    await this.disableApiKey.execute(id);
    return { message: 'API Key desativada com sucesso.' };
  }
}
