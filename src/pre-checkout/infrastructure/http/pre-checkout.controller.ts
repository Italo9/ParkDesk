import { Controller, Get, Param } from '@nestjs/common';
import { ProcessPreCheckoutUseCase } from '../../application/process-pre-checkout.usecase';
import { ParkingCalculationResult, PaymentStatusResult } from '../../domain/pre-checkout';

@Controller('pre-checkout')
export class PreCheckoutController {
  constructor(private readonly processPreCheckout: ProcessPreCheckoutUseCase) {}

  @Get(':ticketNumber')
  async getPreCheckout(
    @Param('ticketNumber') ticketNumber: number,
  ): Promise<ParkingCalculationResult | PaymentStatusResult> {
    return this.processPreCheckout.execute(ticketNumber);
  }
}
