export const TICKET_GATEWAY = Symbol('CHECKOUT_TICKET_GATEWAY');

export interface TicketRef {
  id: number;
  companyId: number;
}

export interface TicketGateway {
  setCheckoutTime(ticketCode: number, checkoutTime: string): Promise<void>;
  findByNumber(ticketNumber: number): Promise<TicketRef | null>;
}
