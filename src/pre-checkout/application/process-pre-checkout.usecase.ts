import { Inject, Injectable } from '@nestjs/common';
import { TicketStatus } from '../../ticket/enums/ticket-status.enum';
import {
  CompanySettingNotFound,
  InvalidTicketStatus,
  ParkingCalculationResult,
  PaymentStatusResult,
  TicketNotFound,
  TicketView,
} from '../domain/pre-checkout';
import { calculateParkingFee, timeAfterPayment } from '../domain/parking-fee.calculator';
import { TICKET_GATEWAY, TicketGateway } from '../domain/ports/ticket-gateway';
import { SETTINGS_GATEWAY, SettingsGateway } from '../domain/ports/settings-gateway';

const GRACE_PERIOD_MINUTES = 15;

@Injectable()
export class ProcessPreCheckoutUseCase {
  constructor(
    @Inject(TICKET_GATEWAY) private readonly tickets: TicketGateway,
    @Inject(SETTINGS_GATEWAY) private readonly settings: SettingsGateway,
  ) {}

  async execute(ticketNumber: number): Promise<ParkingCalculationResult | PaymentStatusResult> {
    const ticket = await this.tickets.getByNumber(ticketNumber);
    if (!ticket) throw new TicketNotFound(ticketNumber);
    return this.handleStatus(ticket);
  }

  private async handleStatus(
    ticket: TicketView,
  ): Promise<ParkingCalculationResult | PaymentStatusResult> {
    switch (ticket.status) {
      case TicketStatus.OPEN:
        return this.calculateFee(ticket);
      case TicketStatus.PAID:
        return this.checkPaymentStatus(ticket);
      case TicketStatus.CLOSED:
        return { message: 'Ticket fechado' };
      default:
        throw new InvalidTicketStatus();
    }
  }

  private async calculateFee(ticket: TicketView): Promise<ParkingCalculationResult> {
    const settings = await this.settings.getByCompanyId(ticket.companyId);
    if (!settings) throw new CompanySettingNotFound(ticket.companyId);
    return calculateParkingFee(ticket, settings);
  }

  private async checkPaymentStatus(
    ticket: TicketView,
  ): Promise<ParkingCalculationResult | PaymentStatusResult> {
    const elapsed = timeAfterPayment(ticket);
    if (elapsed > GRACE_PERIOD_MINUTES) {
      return this.calculateFee(ticket);
    }
    return { message: 'Ticket pago', amountDue: 0 };
  }
}
