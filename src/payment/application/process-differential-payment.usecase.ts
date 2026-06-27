import { Inject, Injectable } from '@nestjs/common';
import { TicketStatus } from '../../ticket/enums/ticket-status.enum';
import {
  DifferentialNotAvailable,
  DifferentialResult,
  TicketNotFoundOrPaid,
  ToleranceNotExceeded,
} from '../domain/payment';
import { PAYMENT_REPOSITORY, PaymentRepository } from '../domain/ports/payment.repository';
import { TICKET_GATEWAY, TicketGateway } from '../domain/ports/ticket-gateway';
import { SETTINGS_GATEWAY, SettingsGateway } from '../domain/ports/settings-gateway';

@Injectable()
export class ProcessDifferentialPaymentUseCase {
  constructor(
    @Inject(PAYMENT_REPOSITORY) private readonly payments: PaymentRepository,
    @Inject(TICKET_GATEWAY) private readonly tickets: TicketGateway,
    @Inject(SETTINGS_GATEWAY) private readonly settings: SettingsGateway,
  ) {}

  async execute(ticketId: number, companyId: number): Promise<DifferentialResult> {
    const ticket = await this.tickets.findById(ticketId);
    if (!ticket || ticket.status === TicketStatus.PAID) throw new TicketNotFoundOrPaid();

    const setting = await this.settings.get(companyId);
    if (!setting || !setting.autorecharge) throw new DifferentialNotAvailable();

    const now = new Date();
    const exitTime = ticket.checkoutTime as Date;
    if (now <= exitTime) throw new ToleranceNotExceeded();

    const additionalTime = now.getTime() - exitTime.getTime();
    const additionalHours = Math.ceil(additionalTime / (1000 * 3600));
    const additionalValue = additionalHours * setting.valueHour;

    await this.payments.saveDifferential({
      ticketId: ticket.id,
      value: additionalValue,
      paymentMethod: 'PIX',
    });

    return {
      qrCode: `pix://pay?value=${additionalValue}&ticketId=${ticket.id}`,
      message: 'Pagamento diferencial gerado com sucesso!',
    };
  }
}
