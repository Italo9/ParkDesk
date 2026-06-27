import { Inject, Injectable } from '@nestjs/common';
import { CheckoutNotFound } from '../domain/checkout';
import { CHECKOUT_REPOSITORY, CheckoutRepository } from '../domain/ports/checkout.repository';

@Injectable()
export class UpdateCheckoutStatusUseCase {
  constructor(@Inject(CHECKOUT_REPOSITORY) private readonly checkouts: CheckoutRepository) {}

  async execute(checkoutId: number, newStatus: string): Promise<void> {
    const checkout = await this.checkouts.findById(checkoutId);
    if (!checkout) throw new CheckoutNotFound(checkoutId);
    await this.checkouts.updateStatus(checkout.id, newStatus);
  }
}
