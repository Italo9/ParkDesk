import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { User } from '../user/entities/user.entity';
import { UserCompany } from '@/shared/entities/user-company.entity';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { CompanyController } from './infrastructure/http/company.controller';
import { TypeOrmCompanyRepository } from './infrastructure/persistence/typeorm-company.repository';
import { UserGatewayAdapter } from './infrastructure/user/user.gateway.adapter';
import { COMPANY_REPOSITORY } from './domain/ports/company.repository';
import { USER_GATEWAY } from './domain/ports/user-gateway';
import { GetCompanyByIdUseCase } from './application/get-company-by-id.usecase';
import { FindOneCompanyUseCase } from './application/find-one-company.usecase';
import { FindAllCompaniesUseCase } from './application/find-all-companies.usecase';
import { FindCompaniesByIdUseCase } from './application/find-companies-by-id.usecase';
import { CreateCompanyUseCase } from './application/create-company.usecase';
import { CreateCompanyByManagerUseCase } from './application/create-company-by-manager.usecase';
import { UpdateCompanyUseCase } from './application/update-company.usecase';
import { RemoveCompanyUseCase } from './application/remove-company.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserCompany, Company, User]),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [CompanyController],
  providers: [
    { provide: COMPANY_REPOSITORY, useClass: TypeOrmCompanyRepository },
    { provide: USER_GATEWAY, useClass: UserGatewayAdapter },
    GetCompanyByIdUseCase,
    FindOneCompanyUseCase,
    FindAllCompaniesUseCase,
    FindCompaniesByIdUseCase,
    CreateCompanyUseCase,
    CreateCompanyByManagerUseCase,
    UpdateCompanyUseCase,
    RemoveCompanyUseCase,
  ],
  exports: [
    GetCompanyByIdUseCase,
    FindOneCompanyUseCase,
    FindCompaniesByIdUseCase,
    TypeOrmModule,
  ],
})
export class CompanyModule {}
