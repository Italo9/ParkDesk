import { Checkout } from '../checkout';

export const CHECKOUT_REPOSITORY = Symbol('CHECKOUT_REPOSITORY');

export interface SaveCheckoutData {
  url: string;
  valor: number;
  status: string;
  ticketId: number;
}

export interface CheckoutRepository {
  save(data: SaveCheckoutData): Promise<void>;
  findByTicketId(ticketId: number): Promise<Checkout | null>;
  findById(id: number): Promise<Checkout | null>;
  updateStatus(id: number, status: string): Promise<void>;
}
