export const TICKET_GATEWAY = Symbol('PAYMENT_TICKET_GATEWAY');

export interface TicketView {
  id: number;
  status: string;
  checkoutTime?: Date;
  companyId: number;
}

export interface TicketGateway {
  findById(id: number): Promise<TicketView | null>;
  close(ticketId: number): Promise<void>;
}
