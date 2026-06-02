import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { AuthGuard, AuthRequest } from '../auth/guards/auth.guard';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { checkPermission } from '@/utils/check-permission';
import { User } from '@/user/entities/user.entity';
import { CreateCompanyByManagerDto } from './dto/create-company-by-manager.dto';

@ApiTags('company')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova empresa' })
  @UseGuards(AuthGuard)
  create(@Body() createCompanyDto: CreateCompanyDto, @Req() request: AuthRequest) {
    const user: User = request.user as User;
    checkPermission(user, 'createCompanyByManager', request.companies);
    if (user?.type.toLowerCase() === 'manager') return this.companyService.createCompanyByManager(createCompanyDto, request.headers.authorization as string);
    return this.companyService.create(createCompanyDto, request.headers.authorization as string);
  }

  @Post('createCompanyByManager')
  @UseGuards(AuthGuard)
  createCompanyByManager(@Body() createCompanyDto: CreateCompanyByManagerDto, @Req() request: AuthRequest) {
    const user: User = request.user as User;
    checkPermission(user, 'createCompanyByManager', request.companies);
    if (user?.type.toLowerCase() === 'manager') return this.companyService.createCompanyByManager(createCompanyDto, request.headers.authorization as string, user);
  }

  @Get('all')
  @ApiOperation({ summary: 'Busca todas as empresas' })
  @UseGuards(AuthGuard)
  findAll(@Req() request: AuthRequest) {
    return this.companyService.findAll(request.headers.authorization as string);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: 'string' })
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: 'string' })
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto, @Req() request: AuthRequest) {
    const user: User = request.user as User;
    checkPermission(user, 'update', request.companies);
    return this.companyService.update(id, updateCompanyDto, request.headers.authorization as string);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: 'string' })
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @Req() request: AuthRequest) {
    const user: User = request.user as User;
    checkPermission(user, 'remove', request.companies);
    return this.companyService.remove(id, request.headers.authorization as string);
  }
}
