export const CHECKOUT_GATEWAY = Symbol('PAYMENT_CHECKOUT_GATEWAY');

export interface CheckoutView {
  id: number;
  ticketId: number | null;
}

export interface CheckoutGateway {
  getById(checkoutId: number): Promise<CheckoutView>;
}
