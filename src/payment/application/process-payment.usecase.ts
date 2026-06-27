import { Inject, Injectable } from '@nestjs/common';
import { PAYMENT_REPOSITORY, PaymentRepository } from '../domain/ports/payment.repository';
import { CHECKOUT_GATEWAY, CheckoutGateway } from '../domain/ports/checkout-gateway';

@Injectable()
export class ProcessPaymentUseCase {
  constructor(
    @Inject(PAYMENT_REPOSITORY) private readonly payments: PaymentRepository,
    @Inject(CHECKOUT_GATEWAY) private readonly checkouts: CheckoutGateway,
  ) {}

  async execute(checkoutId: number, paymentDetails: any): Promise<void> {
    await this.checkouts.getById(checkoutId);

    const exists = await this.payments.existsByCheckoutId(checkoutId);
    if (!exists) {
      await this.payments.createForCheckout({
        checkoutId,
        paymentMethod: paymentDetails.allowed_methods,
        paymentDate: paymentDetails.payments[0].created_at,
        value: paymentDetails.payments[0].amount.amount,
      });
    }
  }
}
