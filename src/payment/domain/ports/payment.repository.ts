export const PAYMENT_REPOSITORY = Symbol('PAYMENT_REPOSITORY');

export interface SaveDifferentialData {
  ticketId: number;
  value: number;
  paymentMethod: string;
}

export interface CreateForCheckoutData {
  checkoutId: number;
  paymentMethod: string;
  paymentDate: Date;
  value: number;
}

export interface PaymentRepository {
  saveDifferential(data: SaveDifferentialData): Promise<void>;
  existsByCheckoutId(checkoutId: number): Promise<boolean>;
  createForCheckout(data: CreateForCheckoutData): Promise<void>;
}
