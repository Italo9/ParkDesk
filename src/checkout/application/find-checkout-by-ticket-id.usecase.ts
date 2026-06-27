import { Inject, Injectable } from '@nestjs/common';
import { Checkout } from '../domain/checkout';
import { CHECKOUT_REPOSITORY, CheckoutRepository } from '../domain/ports/checkout.repository';
import { TICKET_GATEWAY, TicketGateway } from '../domain/ports/ticket-gateway';

@Injectable()
export class FindCheckoutByTicketIdUseCase {
  constructor(
    @Inject(CHECKOUT_REPOSITORY) private readonly checkouts: CheckoutRepository,
    @Inject(TICKET_GATEWAY) private readonly tickets: TicketGateway,
  ) {}

  async execute(ticketId: number): Promise<Checkout | null> {
    const ticketResult = await this.tickets.findByNumber(Number(ticketId));
    return this.checkouts.findByTicketId(ticketResult!.id);
  }
}
