import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { config } from 'dotenv';
import { User } from './entities/user.entity';
import { UserCompany } from '../shared/entities/user-company.entity';
import { Company } from '@/company/entities/company.entity';
import { CompanyModule } from '../company/company.module';
import { AuthModule } from '../auth/auth.module';
import { ApiKeyModule } from '../api_key/api-key.module';
import { StackAuthAdapter } from '../auth/adapters/stack-auth.adapter';
import { UserController } from './infrastructure/http/user.controller';
import { TypeOrmUserRepository } from './infrastructure/persistence/typeorm-user.repository';
import { StackIdentityGateway } from './infrastructure/identity/stack-identity.gateway';
import { CompanyGatewayAdapter } from './infrastructure/company/company.gateway.adapter';
import { MailerGatewayAdapter } from './infrastructure/mailer/mailer.gateway.adapter';
import { USER_REPOSITORY } from './domain/ports/user.repository';
import { IDENTITY_GATEWAY } from './domain/ports/identity-gateway';
import { COMPANY_GATEWAY } from './domain/ports/company-gateway';
import { MAILER_GATEWAY } from './domain/ports/mailer-gateway';
import { CreateUserUseCase } from './application/create-user.usecase';
import { GetUserByTokenUseCase } from './application/get-user-by-token.usecase';
import { FindByEmailUseCase } from './application/find-by-email.usecase';
import { FindOneCheckoutUseCase } from './application/find-one-checkout.usecase';
import { FindAllUsersUseCase } from './application/find-all-users.usecase';
import { FindOneUserUseCase } from './application/find-one-user.usecase';
import { UpdateUserUseCase } from './application/update-user.usecase';
import { RemoveUserUseCase } from './application/remove-user.usecase';
import { RemoveUsersByCompanyUseCase } from './application/remove-users-by-company.usecase';
import { DeleteIdentityUserUseCase } from './application/delete-identity-user.usecase';
import { SendWelcomeEmailUseCase } from './application/send-welcome-email.usecase';

config();

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserCompany, Company]),
    forwardRef(() => CompanyModule),
    forwardRef(() => AuthModule),
    ConfigModule,
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      },
      defaults: { from: process.env.SMTP_FROM },
      template: {
        dir: __dirname + '/templates',
        adapter: new HandlebarsAdapter(),
        options: { strict: true },
      },
    }),
    forwardRef(() => ApiKeyModule),
  ],
  controllers: [UserController],
  providers: [
    StackAuthAdapter,
    { provide: USER_REPOSITORY, useClass: TypeOrmUserRepository },
    { provide: IDENTITY_GATEWAY, useClass: StackIdentityGateway },
    { provide: COMPANY_GATEWAY, useClass: CompanyGatewayAdapter },
    { provide: MAILER_GATEWAY, useClass: MailerGatewayAdapter },
    CreateUserUseCase,
    GetUserByTokenUseCase,
    FindByEmailUseCase,
    FindOneCheckoutUseCase,
    FindAllUsersUseCase,
    FindOneUserUseCase,
    UpdateUserUseCase,
    RemoveUserUseCase,
    RemoveUsersByCompanyUseCase,
    DeleteIdentityUserUseCase,
    SendWelcomeEmailUseCase,
  ],
  exports: [
    GetUserByTokenUseCase,
    FindByEmailUseCase,
    FindOneCheckoutUseCase,
    CreateUserUseCase,
    RemoveUserUseCase,
    RemoveUsersByCompanyUseCase,
    DeleteIdentityUserUseCase,
    SendWelcomeEmailUseCase,
    TypeOrmModule,
  ],
})
export class UserModule {}
