import { Body, Controller, Post, Param, Req } from '@nestjs/common';
import { Request } from 'express';
import { HandlePaymentWebhookUseCase } from '../../application/handle-payment-webhook.usecase';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly handlePaymentWebhook: HandlePaymentWebhookUseCase) {}

  @Post(':ticketNumber')
  async paymentWebhook(
    @Param('ticketNumber') ticketNumber: string,
    @Body() paymentDetails: any,
    @Req() req: Request,
  ): Promise<{ message: string }> {
    console.log(`Pagamento recebido para o ticket: ${ticketNumber}`);
    await this.handlePaymentWebhook.execute(ticketNumber, paymentDetails);
    return { message: `Pagamento confirmado para o ticket ${ticketNumber}` };
  }
}
