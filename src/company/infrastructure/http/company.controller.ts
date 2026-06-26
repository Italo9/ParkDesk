import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuard, AuthRequest } from '@/auth/guards/auth.guard';
import { checkPermission } from '@/utils/check-permission';
import { User } from '@/user/entities/user.entity';
import { CreateCompanyDto } from '../../dto/create-company.dto';
import { UpdateCompanyDto } from '../../dto/update-company.dto';
import { CreateCompanyByManagerDto } from '../../dto/create-company-by-manager.dto';
import { CreateCompanyUseCase } from '../../application/create-company.usecase';
import { CreateCompanyByManagerUseCase } from '../../application/create-company-by-manager.usecase';
import { FindAllCompaniesUseCase } from '../../application/find-all-companies.usecase';
import { FindOneCompanyUseCase } from '../../application/find-one-company.usecase';
import { UpdateCompanyUseCase } from '../../application/update-company.usecase';
import { RemoveCompanyUseCase } from '../../application/remove-company.usecase';

interface RequesterUser {
  id: string;
  companies: { id: number }[];
}

@ApiTags('company')
@Controller('company')
export class CompanyController {
  constructor(
    private readonly createCompany: CreateCompanyUseCase,
    private readonly createCompanyByManager: CreateCompanyByManagerUseCase,
    private readonly findAllCompanies: FindAllCompaniesUseCase,
    private readonly findOneCompany: FindOneCompanyUseCase,
    private readonly updateCompany: UpdateCompanyUseCase,
    private readonly removeCompany: RemoveCompanyUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova empresa' })
  @UseGuards(AuthGuard)
  create(@Body() dto: CreateCompanyDto, @Req() request: AuthRequest) {
    const user = request.user as User;
    checkPermission(user, 'createCompanyByManager', request.companies);
    if (user?.type.toLowerCase() === 'manager') {
      return this.createCompanyByManager.execute(
        dto as unknown as CreateCompanyByManagerDto,
        request.headers.authorization as string,
      );
    }
    return this.createCompany.execute(dto, request.headers.authorization as string);
  }

  @Post('createCompanyByManager')
  @UseGuards(AuthGuard)
  createByManager(@Body() dto: CreateCompanyByManagerDto, @Req() request: AuthRequest) {
    const user = request.user as User;
    checkPermission(user, 'createCompanyByManager', request.companies);
    if (user?.type.toLowerCase() === 'manager') {
      return this.createCompanyByManager.execute(
        dto,
        request.headers.authorization as string,
        user as unknown as RequesterUser,
      );
    }
  }

  @Get('all')
  @ApiOperation({ summary: 'Busca todas as empresas' })
  @UseGuards(AuthGuard)
  findAll(@Req() request: AuthRequest) {
    return this.findAllCompanies.execute(request.headers.authorization as string);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: 'string' })
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.findOneCompany.execute(id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: 'string' })
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() dto: UpdateCompanyDto, @Req() request: AuthRequest) {
    const user = request.user as User;
    checkPermission(user, 'update', request.companies);
    return this.updateCompany.execute(id, dto, request.headers.authorization as string);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: 'string' })
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @Req() request: AuthRequest) {
    const user = request.user as User;
    checkPermission(user, 'remove', request.companies);
    return this.removeCompany.execute(id, request.headers.authorization as string);
  }
}
