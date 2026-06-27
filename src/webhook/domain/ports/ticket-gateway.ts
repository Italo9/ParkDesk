export const TICKET_GATEWAY = Symbol('WEBHOOK_TICKET_GATEWAY');

export interface TicketGateway {
  markPaid(ticketNumber: number, paymentTime: string): Promise<void>;
}
