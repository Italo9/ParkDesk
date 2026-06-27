import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { TicketModule } from '../ticket/ticket.module';
import { CompanySettingModule } from '../company-setting/company-setting.module';
import { CheckoutModule } from '../checkout/checkout.module';
import { PaymentController } from './infrastructure/http/payment.controller';
import { TypeOrmPaymentRepository } from './infrastructure/persistence/typeorm-payment.repository';
import { TicketGatewayAdapter } from './infrastructure/ticket/ticket.gateway.adapter';
import { SettingsGatewayAdapter } from './infrastructure/settings/settings.gateway.adapter';
import { CheckoutGatewayAdapter } from './infrastructure/checkout/checkout.gateway.adapter';
import { PAYMENT_REPOSITORY } from './domain/ports/payment.repository';
import { TICKET_GATEWAY } from './domain/ports/ticket-gateway';
import { SETTINGS_GATEWAY } from './domain/ports/settings-gateway';
import { CHECKOUT_GATEWAY } from './domain/ports/checkout-gateway';
import { ProcessDifferentialPaymentUseCase } from './application/process-differential-payment.usecase';
import { ProcessPaymentUseCase } from './application/process-payment.usecase';
import { CloseTicketUseCase } from './application/close-ticket.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    forwardRef(() => TicketModule),
    forwardRef(() => CompanySettingModule),
    forwardRef(() => CheckoutModule),
  ],
  controllers: [PaymentController],
  providers: [
    { provide: PAYMENT_REPOSITORY, useClass: TypeOrmPaymentRepository },
    { provide: TICKET_GATEWAY, useClass: TicketGatewayAdapter },
    { provide: SETTINGS_GATEWAY, useClass: SettingsGatewayAdapter },
    { provide: CHECKOUT_GATEWAY, useClass: CheckoutGatewayAdapter },
    ProcessDifferentialPaymentUseCase,
    ProcessPaymentUseCase,
    CloseTicketUseCase,
  ],
  exports: [ProcessPaymentUseCase, CloseTicketUseCase],
})
export class PaymentModule {}
