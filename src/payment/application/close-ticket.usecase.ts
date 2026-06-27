import { Inject, Injectable } from '@nestjs/common';
import { TicketNotFound } from '../domain/payment';
import { CHECKOUT_GATEWAY, CheckoutGateway } from '../domain/ports/checkout-gateway';
import { TICKET_GATEWAY, TicketGateway } from '../domain/ports/ticket-gateway';

@Injectable()
export class CloseTicketUseCase {
  constructor(
    @Inject(CHECKOUT_GATEWAY) private readonly checkouts: CheckoutGateway,
    @Inject(TICKET_GATEWAY) private readonly tickets: TicketGateway,
  ) {}

  async execute(checkoutId: number): Promise<void> {
    const checkout = await this.checkouts.getById(checkoutId);
    if (!checkout.ticketId) throw new TicketNotFound();
    await this.tickets.close(checkout.ticketId);
  }
}
