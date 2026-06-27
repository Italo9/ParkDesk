import {
  Body,
  Controller,
  Post,
  Param,
  ParseIntPipe,
  HttpException,
  HttpStatus,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiKeyGuard } from '@/api_key/guards/api-key.guard';
import { AuthRequest } from '@/auth/guards/auth.guard';
import { Checkout } from '../../domain/checkout';
import { CreatePaymentBodyDto } from '../../dto/create-checkout.dto';
import { CreatePaymentUseCase } from '../../application/create-payment.usecase';
import { FindCheckoutByTicketIdUseCase } from '../../application/find-checkout-by-ticket-id.usecase';

@Controller('checkout')
export class CheckoutController {
  constructor(
    private readonly createPayment: CreatePaymentUseCase,
    private readonly findCheckoutByTicketId: FindCheckoutByTicketIdUseCase,
  ) {}

  @Post()
  @UseGuards(ApiKeyGuard)
  async createCheckout(
    @Body() dto: CreatePaymentBodyDto,
    @Req() request: AuthRequest,
  ): Promise<{ qr_code: string; payment_url: string }> {
    const result = await this.createPayment.execute(dto, request.headers.authorization as string);
    return { qr_code: result.qrCodePix, payment_url: result.pixUrl };
  }

  @Get('ticket/:ticketId')
  @UseGuards(ApiKeyGuard)
  async findByTicketId(
    @Param('ticketId', ParseIntPipe) ticketId: number,
  ): Promise<Checkout | null> {
    try {
      const checkout = await this.findCheckoutByTicketId.execute(ticketId);
      if (!checkout) throw new HttpException('Checkout nao encontrado', HttpStatus.NOT_FOUND);
      return checkout;
    } catch (error) {
      console.error('Erro ao buscar checkout pelo ID do ticket:', error);
      throw new HttpException('Erro ao buscar checkout', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
