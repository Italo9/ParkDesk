import { forwardRef, Module } from '@nestjs/common';
import { CheckoutModule } from '../checkout/checkout.module';
import { PaymentModule } from '../payment/payment.module';
import { TicketModule } from '../ticket/ticket.module';
import { WebhookController } from './infrastructure/http/webhook.controller';
import { CheckoutGatewayAdapter } from './infrastructure/checkout/checkout.gateway.adapter';
import { PaymentGatewayAdapter } from './infrastructure/payment/payment.gateway.adapter';
import { TicketGatewayAdapter } from './infrastructure/ticket/ticket.gateway.adapter';
import { CHECKOUT_GATEWAY } from './domain/ports/checkout-gateway';
import { PAYMENT_GATEWAY } from './domain/ports/payment-gateway';
import { TICKET_GATEWAY } from './domain/ports/ticket-gateway';
import { HandlePaymentWebhookUseCase } from './application/handle-payment-webhook.usecase';

@Module({
  imports: [
    forwardRef(() => CheckoutModule),
    forwardRef(() => PaymentModule),
    forwardRef(() => TicketModule),
  ],
  controllers: [WebhookController],
  providers: [
    { provide: CHECKOUT_GATEWAY, useClass: CheckoutGatewayAdapter },
    { provide: PAYMENT_GATEWAY, useClass: PaymentGatewayAdapter },
    { provide: TICKET_GATEWAY, useClass: TicketGatewayAdapter },
    HandlePaymentWebhookUseCase,
  ],
})
export class WebhookModule {}
