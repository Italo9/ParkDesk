import { forwardRef, Module } from '@nestjs/common';
import { ApiKeyController } from './api-key.controller';
import { ApiKeyService } from './api-key.service';
import { EncryptionService } from './encryption.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKey } from './entities/api-key.entity';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { UserService } from '../user/user.service';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [TypeOrmModule.forFeature([ApiKey]), AuthModule, forwardRef(() => UserModule), forwardRef(() => CompanyModule)],
  controllers: [ApiKeyController],
  providers: [ApiKeyService, EncryptionService, UserService],
  exports: [ApiKeyService, EncryptionService, TypeOrmModule, UserService],
})
export class ApiKeyModule {}
