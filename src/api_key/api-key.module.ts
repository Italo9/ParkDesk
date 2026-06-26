import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKey } from './entities/api-key.entity';
import { EncryptionService } from './encryption.service';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { CompanyModule } from '../company/company.module';
import { ApiKeyController } from './infrastructure/http/api-key.controller';
import { TypeOrmApiKeyRepository } from './infrastructure/persistence/typeorm-api-key.repository';
import { CompanyGatewayAdapter } from './infrastructure/company/company.gateway.adapter';
import { RequesterGatewayAdapter } from './infrastructure/requester/requester.gateway.adapter';
import { API_KEY_REPOSITORY } from './domain/ports/api-key.repository';
import { API_KEY_CIPHER } from './domain/ports/api-key-cipher';
import { COMPANY_GATEWAY } from './domain/ports/company-gateway';
import { REQUESTER_GATEWAY } from './domain/ports/requester-gateway';
import { CreateApiKeyUseCase } from './application/create-api-key.usecase';
import { FindApiKeyUseCase } from './application/find-api-key.usecase';
import { ValidateApiKeyUseCase } from './application/validate-api-key.usecase';
import { FindApiKeyByIdUseCase } from './application/find-api-key-by-id.usecase';
import { FindApiKeyByUserIdUseCase } from './application/find-api-key-by-user-id.usecase';
import { UpdateApiKeyUseCase } from './application/update-api-key.usecase';
import { DisableApiKeyUseCase } from './application/disable-api-key.usecase';
import { FindAllByCompanyUseCase } from './application/find-all-by-company.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([ApiKey]),
    AuthModule,
    forwardRef(() => UserModule),
    forwardRef(() => CompanyModule),
  ],
  controllers: [ApiKeyController],
  providers: [
    { provide: API_KEY_REPOSITORY, useClass: TypeOrmApiKeyRepository },
    { provide: API_KEY_CIPHER, useClass: EncryptionService },
    { provide: COMPANY_GATEWAY, useClass: CompanyGatewayAdapter },
    { provide: REQUESTER_GATEWAY, useClass: RequesterGatewayAdapter },
    EncryptionService,
    CreateApiKeyUseCase,
    FindApiKeyUseCase,
    ValidateApiKeyUseCase,
    FindApiKeyByIdUseCase,
    FindApiKeyByUserIdUseCase,
    UpdateApiKeyUseCase,
    DisableApiKeyUseCase,
    FindAllByCompanyUseCase,
  ],
  exports: [
    FindApiKeyUseCase,
    ValidateApiKeyUseCase,
    EncryptionService,
    TypeOrmModule,
  ],
})
export class ApiKeyModule {}
