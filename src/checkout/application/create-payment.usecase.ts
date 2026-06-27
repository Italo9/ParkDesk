import { Inject, Injectable } from '@nestjs/common';
import { PaymentAuthError, PaymentGatewayError } from '../domain/checkout';
import { CHECKOUT_REPOSITORY, CheckoutRepository } from '../domain/ports/checkout.repository';
import { PAYCO_GATEWAY, PaycoGateway } from '../domain/ports/payco-gateway';
import { API_KEY_GATEWAY, ApiKeyGateway } from '../domain/ports/api-key-gateway';
import { TICKET_GATEWAY, TicketGateway } from '../domain/ports/ticket-gateway';
import { SETTINGS_GATEWAY, SettingsGateway } from '../domain/ports/settings-gateway';
import { CreatePaymentBodyDto, CreatePaymentDto } from '../dto/create-checkout.dto';

@Injectable()
export class CreatePaymentUseCase {
  constructor(
    @Inject(CHECKOUT_REPOSITORY) private readonly checkouts: CheckoutRepository,
    @Inject(PAYCO_GATEWAY) private readonly payco: PaycoGateway,
    @Inject(API_KEY_GATEWAY) private readonly apiKeys: ApiKeyGateway,
    @Inject(TICKET_GATEWAY) private readonly tickets: TicketGateway,
    @Inject(SETTINGS_GATEWAY) private readonly settings: SettingsGateway,
  ) {}

  async execute(
    dto: CreatePaymentBodyDto,
    apiKey: string,
  ): Promise<{ qrCodePix: string; pixUrl: string }> {
    try {
      const companyId = await this.apiKeys.companyIdFor(apiKey);
      const accessToken = await this.payco.getAccessToken(companyId as number);

      const payload: CreatePaymentDto = {
        items: dto.items,
        customer: dto.customer,
        shipping: {
          name: 'Nome do Destinatario',
          street: 'Rua Exemplo',
          number: '456',
          complement: '',
          neighborhood: 'Bairro Exemplo',
          city: 'Cidade Exemplo',
          state: 'SP',
          zip_code: '01020000',
        },
        allowed_methods: ['PIX'],
        discounts: [{ method: 'CARD', type: 'PERCENTAGE', value: 10 }],
        callback_url: dto.callback_url,
      };

      const checkout = await this.payco.createCheckout(accessToken, payload);

      const ticketCode = Number(dto.items[0].code);
      await this.tickets.setCheckoutTime(ticketCode, checkout.created_at);

      const ticketResult = await this.tickets.findByNumber(ticketCode);
      const pixExpirationTime = (await this.settings.pixExpirationTime(
        ticketResult!.companyId,
      )) as number;
      const expirationDate = new Date(new Date().getTime() + pixExpirationTime * 60 * 1000);

      const pix = await this.payco.createPixPayment(accessToken, checkout.id, expirationDate);
      const pixUrl = pix.payment_methods.pix.qr_code;
      const qrCodePix = await this.payco.qrCodeImage(pixUrl);

      const ticket = await this.tickets.findByNumber(ticketCode);
      await this.checkouts.save({
        url: qrCodePix,
        valor: pix.payment_methods.pix.final_amount,
        status: pix.payment_methods.pix.status,
        ticketId: ticket!.id,
      });

      return { qrCodePix, pixUrl };
    } catch (error) {
      if (error instanceof PaymentAuthError) throw error;
      console.error('Erro no pagamento:', error);
      throw new PaymentGatewayError();
    }
  }
}
