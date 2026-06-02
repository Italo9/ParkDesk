import { Body, Controller, Post, Param, Req, HttpException, HttpStatus } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { Request } from 'express';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post(':ticketNumber')
  async paymentWebhook(@Param('ticketNumber') ticketNumber: string, @Body() paymentDetails: any, @Req() req: Request): Promise<{ message: string }> {
    console.log(`Pagamento recebido para o ticket: ${ticketNumber}`);
    await this.webhookService.handlePaymentWebhook(ticketNumber, paymentDetails);
    return { message: `Pagamento confirmado para o ticket ${ticketNumber}` };
  }
}
