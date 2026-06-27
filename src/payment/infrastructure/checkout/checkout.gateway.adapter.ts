import { Injectable } from '@nestjs/common';
import { CheckoutGateway, CheckoutView } from '../../domain/ports/checkout-gateway';
import { FindCheckoutByIdUseCase } from '../../../checkout/application/find-checkout-by-id.usecase';

@Injectable()
export class CheckoutGatewayAdapter implements CheckoutGateway {
  constructor(private readonly findCheckoutById: FindCheckoutByIdUseCase) {}

  async getById(checkoutId: number): Promise<CheckoutView> {
    const checkout = await this.findCheckoutById.execute(checkoutId);
    return { id: checkout.id, ticketId: checkout.ticketId };
  }
}
