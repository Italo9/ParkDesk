import { Injectable } from '@nestjs/common';
import { PaymentGateway } from '../../domain/ports/payment-gateway';
import { ProcessPaymentUseCase } from '../../../payment/application/process-payment.usecase';

@Injectable()
export class PaymentGatewayAdapter implements PaymentGateway {
  constructor(private readonly processPayment: ProcessPaymentUseCase) {}

  async process(checkoutId: number, payload: any): Promise<void> {
    await this.processPayment.execute(checkoutId, payload);
  }
}
