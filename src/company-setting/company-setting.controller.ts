import { Controller, Get, Post, Body, Patch, Delete, ParseIntPipe, UseGuards, Req, Param } from '@nestjs/common';
import { CompanySettingService } from './company-setting.service';
import { CreateCompanySettingDto } from './dto/create-company-setting.dto';
import { UpdateCompanySettingDto } from './dto/update-company-setting.dto';
import { AuthGuard, AuthRequest } from '../auth/guards/auth.guard';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@/user/entities/user.entity';
import { checkPermission } from '@/utils/check-permission';

@ApiTags('company-settings')
@Controller('company-settings')
export class CompanySettingController {
  constructor(private readonly companySettingService: CompanySettingService) {}

  @Post()
  @ApiOperation({ summary: 'Define os parâmetros de configuração da empresa' })
  @ApiParam({ name: 'companyId', description: 'Id da empresa' })
  @ApiBody({ type: CreateCompanySettingDto })
  @UseGuards(AuthGuard)
  create(@Body() createCompanySettingDto: CreateCompanySettingDto, @Req() request: AuthRequest) {
    const user: User = request.user as User;
    checkPermission(user, 'create', request.companies);
    return this.companySettingService.create(createCompanySettingDto, request.headers.authorization as string);
  }

  @Get(':companyId')
  @ApiOperation({ summary: 'Busca as configurações da empresa pelo ID' })
  @ApiParam({ name: 'companyId', description: 'Id da empresa' })
  @UseGuards(AuthGuard)
  findOne(@Param('companyId', ParseIntPipe) companyId: number, @Req() request: AuthRequest) {
    return this.companySettingService.getCompanySettings(companyId, request.headers.authorization as string);
  }

  @Patch(':companyId')
  @ApiOperation({ summary: 'Atualiza as configurações da empresa' })
  @ApiParam({ name: 'companyId', description: 'Id da empresa' })
  @UseGuards(AuthGuard)
  update(@Param('companyId', ParseIntPipe) companyId: number, @Body() updateCompanySettingDto: UpdateCompanySettingDto, @Req() request: AuthRequest) {
    const user: User = request.user as User;
    checkPermission(user, 'update', request.companies);
    return this.companySettingService.update(companyId, updateCompanySettingDto, request.headers.authorization as string);
  }

  @Delete(':companyId')
  @ApiOperation({ summary: 'Deleta as configurações da empresa' })
  @ApiParam({ name: 'companyId', description: 'Id da empresa' })
  @UseGuards(AuthGuard)
  remove(@Param('companyId', ParseIntPipe) companyId: number, @Req() request: AuthRequest) {
    const user: User = request.user as User;
    checkPermission(user, 'remove', request.companies);
    return this.companySettingService.remove(companyId, request.headers.authorization as string);
  }
}
