import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanySetting } from './entities/company-setting.entity';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { CompanyModule } from '../company/company.module';
import { CompanySettingController } from './infrastructure/http/company-setting.controller';
import { TypeOrmCompanySettingRepository } from './infrastructure/persistence/typeorm-company-setting.repository';
import { CompanyGatewayAdapter } from './infrastructure/company/company.gateway.adapter';
import { RequesterGatewayAdapter } from './infrastructure/requester/requester.gateway.adapter';
import { COMPANY_SETTING_REPOSITORY } from './domain/ports/company-setting.repository';
import { COMPANY_GATEWAY } from './domain/ports/company-gateway';
import { REQUESTER_GATEWAY } from './domain/ports/requester-gateway';
import { CreateCompanySettingUseCase } from './application/create-company-setting.usecase';
import { GetCompanySettingByCompanyUseCase } from './application/get-company-setting-by-company.usecase';
import { GetSettingByCompanyIdUseCase } from './application/get-setting-by-company-id.usecase';
import { UpdateCompanySettingUseCase } from './application/update-company-setting.usecase';
import { RemoveCompanySettingUseCase } from './application/remove-company-setting.usecase';
import { IsAutoRechargeActiveUseCase } from './application/is-auto-recharge-active.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanySetting]),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    forwardRef(() => CompanyModule),
  ],
  controllers: [CompanySettingController],
  providers: [
    { provide: COMPANY_SETTING_REPOSITORY, useClass: TypeOrmCompanySettingRepository },
    { provide: COMPANY_GATEWAY, useClass: CompanyGatewayAdapter },
    { provide: REQUESTER_GATEWAY, useClass: RequesterGatewayAdapter },
    CreateCompanySettingUseCase,
    GetCompanySettingByCompanyUseCase,
    GetSettingByCompanyIdUseCase,
    UpdateCompanySettingUseCase,
    RemoveCompanySettingUseCase,
    IsAutoRechargeActiveUseCase,
  ],
  exports: [
    GetCompanySettingByCompanyUseCase,
    GetSettingByCompanyIdUseCase,
    IsAutoRechargeActiveUseCase,
    TypeOrmModule,
  ],
})
export class CompanySettingModule {}
