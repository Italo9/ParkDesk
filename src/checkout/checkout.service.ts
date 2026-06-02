import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { CreatePaymentBodyDto, CreatePaymentDto } from './dto/create-checkout.dto';
import { AuthGatewayService } from '../auth/auth-gateway.service';
import * as QRCode from 'qrcode';
import { TicketService } from '../ticket/ticket.service';
import { Checkout } from './entities/checkout.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from '../ticket/entities/ticket.entity';
import { CompanySettingService } from '../company-setting/company-setting.service';
import { ApiKeyService } from '@/api_key/api-key.service';
import { ApiKey } from '@/api_key/entities/api-key.entity';

@Injectable()
export class CheckoutService {
  private readonly gatewayUrl: string = process.env.PAYCO_URL as string;
  private readonly webhookUrl: string = process.env.PAYCO_WEBHOOK_URL as string;

  constructor(
    @InjectRepository(Checkout) private readonly checkoutRepository: Repository<Checkout>,
    private readonly authService: AuthGatewayService,
    private readonly ticketService: TicketService,
    private readonly companySettingService: CompanySettingService,
    private readonly apiKeyService: ApiKeyService,
  ) {}

  async createPayment(createPaymentDto: CreatePaymentBodyDto, apiKey): Promise<{ qrCodePix: string; pixUrl: string }> {
    try {
      const accessApiKey = (await this.apiKeyService.findApiKey(apiKey)) as ApiKey;
      const accessToken = await this.authService.getAccessToken(accessApiKey.company.id);

      const paymentData: CreatePaymentDto = {
        items: createPaymentDto.items,
        customer: createPaymentDto.customer,
        shipping: { name: 'Nome do Destinatário', street: 'Rua Exemplo', number: '456', complement: '', neighborhood: 'Bairro Exemplo', city: 'Cidade Exemplo', state: 'SP', zip_code: '01020000' },
        allowed_methods: ['PIX'],
        discounts: [{ method: 'CARD', type: 'PERCENTAGE', value: 10 }],
        callback_url: createPaymentDto.callback_url,
      };

      const response = await fetch(`${this.gatewayUrl}/public-api/api/v1/checkout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData),
        redirect: 'follow',
      });
      const result = JSON.parse(await response.text());

      await this.ticketService.update(Number(createPaymentDto.items[0].code), { checkoutTime: result.created_at });
      const ticketResult = (await this.ticketService.findOneTicketNumber(Number(createPaymentDto.items[0].code))) as Ticket;
      const resultCompanySetting = await this.companySettingService.findOneByCompanyId(ticketResult.company.id);

      const pixExpirationTime = resultCompanySetting?.pixExpirationTime as number;
      const expirationDate = new Date(new Date().getTime() + pixExpirationTime * 60 * 1000);

      const responsePix = await fetch(`${this.gatewayUrl}/public-api/api/v1/checkout/${result.id}/payments/pix`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ expiration_date: expirationDate.toISOString() }),
      });
      const resultPix = JSON.parse(await responsePix.text());
      const pixUrl = resultPix.payment_methods.pix.qr_code;
      const qrCodePix = await QRCode.toDataURL(pixUrl);

      const ticket = (await this.ticketService.findOneTicketNumber(Number(createPaymentDto.items[0].code))) as Ticket;
      await this.checkoutRepository.save({ url: qrCodePix, valor: resultPix.payment_methods.pix.final_amount, status: resultPix.payment_methods.pix.status, ticket, ticketId: ticket.id });

      return { qrCodePix, pixUrl };
    } catch (error) {
      console.error('Erro no pagamento:', error);
      if (error instanceof HttpException) {
        throw new HttpException(`Erro ao autenticar com o Payco: ${error.getResponse()['response']}`, error.getStatus());
      }
      throw new HttpException('Erro no gateway de pagamento.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findCheckoutByTicketId(ticketId: number): Promise<Checkout | null> {
    try {
      const ticketResult = (await this.ticketService.findOneTicketNumber(Number(ticketId))) as Ticket;
      return await this.checkoutRepository.findOne({ where: { ticket: { id: ticketResult.id } }, relations: ['ticket'] });
    } catch (error) {
      console.error('Erro ao buscar checkout pelo ID do ticket:', error);
      throw new HttpException('Erro ao buscar checkout', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findById(id: number): Promise<Checkout> {
    const checkout = await this.checkoutRepository.findOne({ where: { id } });
    if (!checkout) throw new NotFoundException(`Checkout com ID ${id} não encontrado`);
    return checkout;
  }

  async updateCheckoutStatus(ticketId: number, newStatus: string): Promise<void> {
    try {
      const checkout = await this.findById(ticketId);
      if (!checkout) throw new HttpException('Checkout não encontrado', HttpStatus.NOT_FOUND);
      checkout.status = newStatus;
      await this.checkoutRepository.save(checkout);
    } catch (error) {
      console.error('Erro ao atualizar status do checkout:', error);
      throw new HttpException('Erro ao atualizar status do checkout', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
