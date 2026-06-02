import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthUseCase } from './use-cases/auth.use-case';
import { StackAuthAdapter } from './adapters/stack-auth.adapter';
import { AuthGuard } from './guards/auth.guard';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { CompanyModule } from '../company/company.module';
import { SessionService } from './session.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { AuthGatewayService } from './auth-gateway.service';
import { CompanySettingModule } from '../company-setting/company-setting.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => CompanyModule),
    forwardRef(() => CompanySettingModule),
    TypeOrmModule.forFeature([Session]),
    ConfigModule.forRoot(),
    CompanySettingModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthGuard,
    { provide: 'AuthService', useClass: StackAuthAdapter },
    AuthUseCase,
    SessionService,
    StackAuthAdapter,
    AuthGatewayService,
  ],
  exports: ['AuthService', AuthUseCase, SessionService, StackAuthAdapter, TypeOrmModule, AuthGatewayService],
})
export class AuthModule {}
