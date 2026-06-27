import { Inject, Injectable } from '@nestjs/common';
import { Checkout, CheckoutNotFound } from '../domain/checkout';
import { CHECKOUT_REPOSITORY, CheckoutRepository } from '../domain/ports/checkout.repository';

@Injectable()
export class FindCheckoutByIdUseCase {
  constructor(@Inject(CHECKOUT_REPOSITORY) private readonly checkouts: CheckoutRepository) {}

  async execute(id: number): Promise<Checkout> {
    const checkout = await this.checkouts.findById(id);
    if (!checkout) throw new CheckoutNotFound(id);
    return checkout;
  }
}
