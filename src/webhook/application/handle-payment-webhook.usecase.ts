import { Inject, Injectable } from '@nestjs/common';
import { WebhookProcessingError } from '../domain/webhook';
import { CHECKOUT_GATEWAY, CheckoutGateway } from '../domain/ports/checkout-gateway';
import { PAYMENT_GATEWAY, PaymentGateway } from '../domain/ports/payment-gateway';
import { TICKET_GATEWAY, TicketGateway } from '../domain/ports/ticket-gateway';

@Injectable()
export class HandlePaymentWebhookUseCase {
  constructor(
    @Inject(CHECKOUT_GATEWAY) private readonly checkouts: CheckoutGateway,
    @Inject(PAYMENT_GATEWAY) private readonly payments: PaymentGateway,
    @Inject(TICKET_GATEWAY) private readonly tickets: TicketGateway,
  ) {}

  async execute(ticketNumber: string, paymentDetails: any): Promise<void> {
    try {
      const paymentStatus = paymentDetails?.payload?.status;

      if (paymentStatus === 'PAID') {
        const checkout = await this.checkouts.findByTicketNumber(Number(ticketNumber));
        await this.checkouts.updateStatus(checkout!.id, paymentStatus);
        await this.payments.process(checkout!.id, paymentDetails?.payload);
        await this.tickets.markPaid(
          Number(ticketNumber),
          paymentDetails?.payload?.payments[0].created_at,
        );
      } else {
        console.log(`Pagamento nao confirmado para o ticket ${ticketNumber}`);
      }
    } catch (error) {
      console.error('Erro ao processar o webhook de pagamento:', error);
      throw new WebhookProcessingError();
    }
  }
}
