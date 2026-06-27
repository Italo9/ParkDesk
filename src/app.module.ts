import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { CompanyModule } from './company/company.module';
import { CheckoutModule } from './checkout/checkout.module';
import { PaymentModule } from './payment/payment.module';
import { QrcodeModule } from './qrcode/qrcode.module';
import { TicketModule } from './ticket/ticket.module';
import { CompanySettingModule } from './company-setting/company-setting.module';
import { ApiKeyModule } from './api_key/api-key.module';
import { AuthModule } from './auth/auth.module';
import { AppController, ProtectedController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/controllers/auth.controller';
import { AuthGuard } from './auth/guards/auth.guard';
import { AuthUseCase } from './auth/use-cases/auth.use-case';
import { PreCheckoutModule } from './pre-checkout/pre-checkout.module';
import { WebhookModule } from './webhook/webhook.module';
import { SharedModule } from './shared/shared.module';
import { DomainExceptionFilter } from './common/filters/domain-exception.filter';
import { AppDataSource } from './data-source';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => AppDataSource.options,
    }),
    UserModule,
    CompanyModule,
    CheckoutModule,
    PaymentModule,
    TicketModule,
    CompanySettingModule,
    ApiKeyModule,
    QrcodeModule,
    PreCheckoutModule,
    WebhookModule,
    SharedModule,
  ],
  controllers: [AppController, ProtectedController, AuthController],
  providers: [
    AppService,
    AuthUseCase,
    AuthGuard,
    { provide: APP_FILTER, useClass: DomainExceptionFilter },
  ],
})
export class AppModule {}
