export const PAYMENT_GATEWAY = Symbol('WEBHOOK_PAYMENT_GATEWAY');

export interface PaymentGateway {
  process(checkoutId: number, payload: any): Promise<void>;
}
