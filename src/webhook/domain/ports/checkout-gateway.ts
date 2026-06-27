export const CHECKOUT_GATEWAY = Symbol('WEBHOOK_CHECKOUT_GATEWAY');

export interface CheckoutRef {
  id: number;
}

export interface CheckoutGateway {
  findByTicketNumber(ticketNumber: number): Promise<CheckoutRef | null>;
  updateStatus(checkoutId: number, status: string): Promise<void>;
}
