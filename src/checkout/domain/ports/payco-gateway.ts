import { PaycoCheckoutResult, PaycoPixResult } from '../checkout';
import { CreatePaymentDto } from '../../dto/create-checkout.dto';

export const PAYCO_GATEWAY = Symbol('PAYCO_GATEWAY');

export interface PaycoGateway {
  getAccessToken(companyId: number): Promise<string>;
  createCheckout(accessToken: string, payload: CreatePaymentDto): Promise<PaycoCheckoutResult>;
  createPixPayment(
    accessToken: string,
    checkoutId: string,
    expirationDate: Date,
  ): Promise<PaycoPixResult>;
  qrCodeImage(content: string): Promise<string>;
}
