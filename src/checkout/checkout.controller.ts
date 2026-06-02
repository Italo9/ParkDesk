import { Body, Controller, Post, Param, ParseIntPipe, HttpException, HttpStatus, Get, UseGuards, Req } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CreatePaymentBodyDto } from './dto/create-checkout.dto';
import { Checkout } from './entities/checkout.entity';
import { ApiKeyGuard } from '../api_key/guards/api-key.guard';
import { AuthRequest } from '@/auth/guards/auth.guard';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post()
  @UseGuards(ApiKeyGuard)
  async createCheckout(@Body() createPaymentDto: CreatePaymentBodyDto, @Req() request: AuthRequest): Promise<{ qr_code: string; payment_url: string }> {
    const paymentUrl = await this.checkoutService.createPayment(createPaymentDto, request.headers.authorization as string);
    return { qr_code: paymentUrl.qrCodePix, payment_url: paymentUrl.pixUrl };
  }

  @Get('ticket/:ticketId')
  @UseGuards(ApiKeyGuard)
  async findCheckoutByTicketId(@Param('ticketId', ParseIntPipe) ticketId: number): Promise<Checkout | null> {
    try {
      const checkout = await this.checkoutService.findCheckoutByTicketId(ticketId);
      if (!checkout) throw new HttpException('Checkout não encontrado', HttpStatus.NOT_FOUND);
      return checkout;
    } catch (error) {
      console.error('Erro ao buscar checkout pelo ID do ticket:', error);
      throw new HttpException('Erro ao buscar checkout', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
