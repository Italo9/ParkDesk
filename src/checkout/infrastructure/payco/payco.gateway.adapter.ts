import { HttpException, Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';
import { AuthGatewayService } from '../../../auth/auth-gateway.service';
import { PaycoGateway } from '../../domain/ports/payco-gateway';
import { PaycoCheckoutResult, PaycoPixResult, PaymentAuthError } from '../../domain/checkout';
import { CreatePaymentDto } from '../../dto/create-checkout.dto';

@Injectable()
export class PaycoGatewayAdapter implements PaycoGateway {
  private readonly gatewayUrl: string = process.env.PAYCO_URL as string;

  constructor(private readonly authService: AuthGatewayService) {}

  async getAccessToken(companyId: number): Promise<string> {
    try {
      return await this.authService.getAccessToken(companyId);
    } catch (error) {
      if (error instanceof HttpException) {
        const response = error.getResponse() as { response?: string };
        throw new PaymentAuthError(
          `Erro ao autenticar com o Payco: ${response?.response ?? error.message}`,
        );
      }
      throw error;
    }
  }

  async createCheckout(accessToken: string, payload: CreatePaymentDto): Promise<PaycoCheckoutResult> {
    const response = await fetch(`${this.gatewayUrl}/public-api/api/v1/checkout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      redirect: 'follow',
    });
    return JSON.parse(await response.text());
  }

  async createPixPayment(
    accessToken: string,
    checkoutId: string,
    expirationDate: Date,
  ): Promise<PaycoPixResult> {
    const response = await fetch(
      `${this.gatewayUrl}/public-api/api/v1/checkout/${checkoutId}/payments/pix`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ expiration_date: expirationDate.toISOString() }),
      },
    );
    return JSON.parse(await response.text());
  }

  async qrCodeImage(content: string): Promise<string> {
    return QRCode.toDataURL(content);
  }
}
