import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { TicketService } from '../ticket/ticket.service';
import { Checkout } from '../checkout/entities/checkout.entity';
import { Ticket } from '../ticket/entities/ticket.entity';
import { CheckoutService } from '../checkout/checkout.service';
import { PaymentService } from '../payment/payment.service';
import { TicketStatus } from '../ticket/enums/ticket-status.enum';

@Injectable()
export class WebhookService {
  constructor(
    private readonly checkoutService: CheckoutService,
    private readonly ticketService: TicketService,
    private readonly paymentService: PaymentService,
  ) {}

  async handlePaymentWebhook(ticketNumber: string, paymentDetails: any): Promise<void> {
    try {
      const paymentStatus = paymentDetails?.payload?.status;

      if (paymentStatus === 'PAID') {
        const ticket = (await this.ticketService.findOneTicketNumber(Number(ticketNumber))) as Ticket;
        const checkout = (await this.checkoutService.findCheckoutByTicketId(Number(ticketNumber))) as Checkout;
        await this.checkoutService.updateCheckoutStatus(checkout.id, paymentStatus);
        await this.paymentService.processPayment(checkout.id, paymentDetails?.payload);
        await this.ticketService.update(Number(ticketNumber), { paymentTime: paymentDetails?.payload?.payments[0].created_at, status: TicketStatus.PAID });
      } else {
        console.log(`Pagamento não confirmado para o ticket ${ticketNumber}`);
      }
    } catch (error) {
      console.error('Erro ao processar o webhook de pagamento:', error);
      throw new HttpException('Erro ao processar o webhook de pagamento', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
