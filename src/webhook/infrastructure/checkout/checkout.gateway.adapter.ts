import { Injectable } from '@nestjs/common';
import { CheckoutGateway, CheckoutRef } from '../../domain/ports/checkout-gateway';
import { FindCheckoutByTicketIdUseCase } from '../../../checkout/application/find-checkout-by-ticket-id.usecase';
import { UpdateCheckoutStatusUseCase } from '../../../checkout/application/update-checkout-status.usecase';

@Injectable()
export class CheckoutGatewayAdapter implements CheckoutGateway {
  constructor(
    private readonly findCheckoutByTicketId: FindCheckoutByTicketIdUseCase,
    private readonly updateCheckoutStatus: UpdateCheckoutStatusUseCase,
  ) {}

  async findByTicketNumber(ticketNumber: number): Promise<CheckoutRef | null> {
    const checkout = await this.findCheckoutByTicketId.execute(ticketNumber);
    return checkout ? { id: checkout.id } : null;
  }

  async updateStatus(checkoutId: number, status: string): Promise<void> {
    await this.updateCheckoutStatus.execute(checkoutId, status);
  }
}
