import { Controller, Post, Param, Body } from '@nestjs/common';
import { ProcessPaymentDto } from '../../dto/process-payment.dto';
import { ProcessPaymentUseCase } from '../../application/process-payment.usecase';
import { ProcessDifferentialPaymentUseCase } from '../../application/process-differential-payment.usecase';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly processPayment: ProcessPaymentUseCase,
    private readonly processDifferentialPayment: ProcessDifferentialPaymentUseCase,
  ) {}

  @Post(':paymentId/confirm')
  async confirmPayment(@Param('paymentId') paymentId: number, @Body() dto: ProcessPaymentDto) {
    const { transactionId } = dto;
    await this.processPayment.execute(paymentId, transactionId);
    return { message: 'Pagamento confirmado e ticket baixado com sucesso!' };
  }

  @Post('differential/:ticketId')
  async processDifferential(
    @Param('ticketId') ticketId: number,
    @Param('companyId') companyId: number,
  ) {
    return this.processDifferentialPayment.execute(ticketId, companyId);
  }
}
