import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuard, AuthRequest } from '@/auth/guards/auth.guard';
import { User } from '@/user/entities/user.entity';
import { checkPermission } from '@/utils/check-permission';
import { CreateCompanySettingDto } from '../../dto/create-company-setting.dto';
import { UpdateCompanySettingDto } from '../../dto/update-company-setting.dto';
import { CreateCompanySettingUseCase } from '../../application/create-company-setting.usecase';
import { GetCompanySettingByCompanyUseCase } from '../../application/get-company-setting-by-company.usecase';
import { UpdateCompanySettingUseCase } from '../../application/update-company-setting.usecase';
import { RemoveCompanySettingUseCase } from '../../application/remove-company-setting.usecase';

@ApiTags('company-settings')
@Controller('company-settings')
export class CompanySettingController {
  constructor(
    private readonly createSetting: CreateCompanySettingUseCase,
    private readonly getSetting: GetCompanySettingByCompanyUseCase,
    private readonly updateSetting: UpdateCompanySettingUseCase,
    private readonly removeSetting: RemoveCompanySettingUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Define os parametros de configuracao da empresa' })
  @ApiBody({ type: CreateCompanySettingDto })
  @UseGuards(AuthGuard)
  create(@Body() dto: CreateCompanySettingDto, @Req() request: AuthRequest) {
    const user = request.user as User;
    checkPermission(user, 'create', request.companies);
    return this.createSetting.execute(dto, request.headers.authorization as string);
  }

  @Get(':companyId')
  @ApiOperation({ summary: 'Busca as configuracoes da empresa pelo ID' })
  @ApiParam({ name: 'companyId', description: 'Id da empresa' })
  @UseGuards(AuthGuard)
  findOne(@Param('companyId', ParseIntPipe) companyId: number, @Req() request: AuthRequest) {
    return this.getSetting.execute(companyId, request.headers.authorization as string);
  }

  @Patch(':companyId')
  @ApiOperation({ summary: 'Atualiza as configuracoes da empresa' })
  @ApiParam({ name: 'companyId', description: 'Id da empresa' })
  @UseGuards(AuthGuard)
  update(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Body() dto: UpdateCompanySettingDto,
    @Req() request: AuthRequest,
  ) {
    const user = request.user as User;
    checkPermission(user, 'update', request.companies);
    return this.updateSetting.execute(companyId, dto, request.headers.authorization as string);
  }

  @Delete(':companyId')
  @ApiOperation({ summary: 'Deleta as configuracoes da empresa' })
  @ApiParam({ name: 'companyId', description: 'Id da empresa' })
  @UseGuards(AuthGuard)
  remove(@Param('companyId', ParseIntPipe) companyId: number, @Req() request: AuthRequest) {
    const user = request.user as User;
    checkPermission(user, 'remove', request.companies);
    return this.removeSetting.execute(companyId, request.headers.authorization as string);
  }
}
