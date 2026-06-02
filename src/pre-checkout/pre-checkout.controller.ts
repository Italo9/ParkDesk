import { Controller, Get, Param } from '@nestjs/common';
import { PreCheckoutService } from './pre-checkout.service';
import { ParkingCalculationResult, PaymentStatusResult } from './pre-checkout.service';

@Controller('pre-checkout')
export class PreCheckoutController {
  constructor(private readonly preCheckoutService: PreCheckoutService) {}

  @Get(':ticketNumber')
  async getPreCheckout(@Param('ticketNumber') ticketNumber: number): Promise<ParkingCalculationResult | PaymentStatusResult> {
    return this.preCheckoutService.processPreCheckout(ticketNumber);
  }
}
