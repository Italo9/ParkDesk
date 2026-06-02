import { Controller, Post, Param, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ProcessPaymentDto } from './dto/process-payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post(':paymentId/confirm')
  async confirmPayment(@Param('paymentId') paymentId: number, @Body() processPaymentDto: ProcessPaymentDto) {
    const { transactionId } = processPaymentDto;
    await this.paymentService.processPayment(paymentId, transactionId);
    return { message: 'Pagamento confirmado e ticket baixado com sucesso!' };
  }

  @Post('differential/:ticketId')
  async processDifferentialPayment(@Param('ticketId') ticketId: number, @Param('companyId') companyId: number) {
    return this.paymentService.processDifferentialPayment(ticketId, companyId);
  }
}
