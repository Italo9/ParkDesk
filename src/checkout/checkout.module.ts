import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Checkout } from './entities/checkout.entity';
import { AuthGatewayService } from '../auth/auth-gateway.service';
import { TicketModule } from '../ticket/ticket.module';
import { CompanySettingModule } from '../company-setting/company-setting.module';
import { ApiKeyModule } from '../api_key/api-key.module';
import { CheckoutController } from './infrastructure/http/checkout.controller';
import { TypeOrmCheckoutRepository } from './infrastructure/persistence/typeorm-checkout.repository';
import { PaycoGatewayAdapter } from './infrastructure/payco/payco.gateway.adapter';
import { ApiKeyGatewayAdapter } from './infrastructure/api-key/api-key.gateway.adapter';
import { TicketGatewayAdapter } from './infrastructure/ticket/ticket.gateway.adapter';
import { SettingsGatewayAdapter } from './infrastructure/settings/settings.gateway.adapter';
import { CHECKOUT_REPOSITORY } from './domain/ports/checkout.repository';
import { PAYCO_GATEWAY } from './domain/ports/payco-gateway';
import { API_KEY_GATEWAY } from './domain/ports/api-key-gateway';
import { TICKET_GATEWAY } from './domain/ports/ticket-gateway';
import { SETTINGS_GATEWAY } from './domain/ports/settings-gateway';
import { CreatePaymentUseCase } from './application/create-payment.usecase';
import { FindCheckoutByTicketIdUseCase } from './application/find-checkout-by-ticket-id.usecase';
import { FindCheckoutByIdUseCase } from './application/find-checkout-by-id.usecase';
import { UpdateCheckoutStatusUseCase } from './application/update-checkout-status.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([Checkout]),
    forwardRef(() => TicketModule),
    forwardRef(() => CompanySettingModule),
    forwardRef(() => ApiKeyModule),
  ],
  controllers: [CheckoutController],
  providers: [
    AuthGatewayService,
    { provide: CHECKOUT_REPOSITORY, useClass: TypeOrmCheckoutRepository },
    { provide: PAYCO_GATEWAY, useClass: PaycoGatewayAdapter },
    { provide: API_KEY_GATEWAY, useClass: ApiKeyGatewayAdapter },
    { provide: TICKET_GATEWAY, useClass: TicketGatewayAdapter },
    { provide: SETTINGS_GATEWAY, useClass: SettingsGatewayAdapter },
    CreatePaymentUseCase,
    FindCheckoutByTicketIdUseCase,
    FindCheckoutByIdUseCase,
    UpdateCheckoutStatusUseCase,
  ],
  exports: [
    FindCheckoutByIdUseCase,
    FindCheckoutByTicketIdUseCase,
    UpdateCheckoutStatusUseCase,
    TypeOrmModule,
  ],
})
export class CheckoutModule {}
