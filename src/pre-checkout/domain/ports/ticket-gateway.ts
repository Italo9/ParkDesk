import { TicketView } from '../pre-checkout';

export const TICKET_GATEWAY = Symbol('PRE_CHECKOUT_TICKET_GATEWAY');

export interface TicketGateway {
  getByNumber(ticketNumber: number): Promise<TicketView | null>;
}
