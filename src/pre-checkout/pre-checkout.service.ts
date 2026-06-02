import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TicketService } from '../ticket/ticket.service';
import { CompanySettingService } from '../company-setting/company-setting.service';
import { TicketStatus } from '../ticket/enums/ticket-status.enum';
import { Ticket } from '@/ticket/entities/ticket.entity';

export interface ParkingCalculationResult {
  duration: string;
  amountDue: string;
}

export interface PaymentStatusResult {
  message: string;
  amountDue?: number;
}

@Injectable()
export class PreCheckoutService {
  private readonly MINUTES_PER_HOUR = 60;
  private readonly MINUTES_PER_FRACTION = 15;
  private readonly FRACTIONS_PER_HOUR = 4;
  private readonly GRACE_PERIOD_MINUTES = 15;

  constructor(
    private readonly ticketService: TicketService,
    private readonly companySettingService: CompanySettingService,
  ) {}

  async processPreCheckout(ticketNumber: number): Promise<ParkingCalculationResult | PaymentStatusResult> {
    const ticket = await this.validateAndGetTicket(ticketNumber);
    return this.handleTicketStatus(ticket);
  }

  private async validateAndGetTicket(ticketNumber: number): Promise<Ticket> {
    const ticket = await this.ticketService.findOneTicketNumber(ticketNumber);
    if (!ticket) throw new NotFoundException(`Ticket com Nº ${ticketNumber} não encontrado`);
    return ticket;
  }

  private async handleTicketStatus(ticket: Ticket): Promise<ParkingCalculationResult | PaymentStatusResult> {
    switch (ticket.status) {
      case TicketStatus.OPEN: return this.calculateParkingFee(ticket);
      case TicketStatus.PAID: return this.checkPaymentStatus(ticket);
      case TicketStatus.CLOSED: return { message: 'Ticket fechado' };
      default: throw new BadRequestException('Status do ticket inválido');
    }
  }

  private async calculateParkingFee(ticket: Ticket): Promise<ParkingCalculationResult> {
    const companySettings = await this.getCompanySettings(ticket.company.id);
    const durationInMinutes = this.calculateParkingDuration(ticket);
    const { fullHours, remainingMinutes } = this.calculateTimeComponents(durationInMinutes);
    const fullHoursValue = this.calculateFullHoursValue(fullHours, companySettings.ValueHour);
    const fractionValue = this.calculateFractionValue(remainingMinutes, companySettings.ValueFractionHour, companySettings.ValueHour);
    return { duration: `${fullHours} horas e ${remainingMinutes} minutos`, amountDue: (fullHoursValue + fractionValue).toFixed(2) };
  }

  private async getCompanySettings(companyId: number) {
    const settings = await this.companySettingService.findOneByCompanyId(companyId);
    if (!settings) throw new NotFoundException(`Configuração da empresa ID ${companyId} não encontrada`);
    return settings;
  }

  private calculateTimeComponents(durationInMinutes: number) {
    return { fullHours: Math.floor(durationInMinutes / this.MINUTES_PER_HOUR), remainingMinutes: durationInMinutes % this.MINUTES_PER_HOUR };
  }

  private calculateFullHoursValue(hours: number, hourlyRate: number): number {
    return hours * hourlyRate;
  }

  private calculateFractionValue(minutes: number, fractionRate: number, hourlyRate: number): number {
    if (minutes <= 0) return 0;
    const roundedMinutes = Math.ceil(minutes / this.MINUTES_PER_FRACTION) * this.MINUTES_PER_FRACTION;
    const fractionCount = roundedMinutes / this.MINUTES_PER_FRACTION;
    return fractionCount === this.FRACTIONS_PER_HOUR ? hourlyRate : fractionCount * fractionRate;
  }

  private async checkPaymentStatus(ticket: Ticket): Promise<ParkingCalculationResult | PaymentStatusResult> {
    const timeAfterPayment = this.calculateTimeAfterPayment(ticket);
    if (timeAfterPayment > this.GRACE_PERIOD_MINUTES) return this.calculateParkingFee(ticket);
    return { message: 'Ticket pago', amountDue: 0 };
  }

  private calculateParkingDuration(ticket: Ticket): number {
    if (ticket.status === TicketStatus.OPEN) return this.calculateTimeDifferenceInMinutes(new Date(), new Date(ticket.checkInTime));
    if (ticket.status === TicketStatus.PAID) return this.calculateTimeAfterPayment(ticket);
    throw new BadRequestException('Status do ticket inválido');
  }

  private calculateTimeAfterPayment(ticket: Ticket): number {
    return this.calculateTimeDifferenceInMinutes(new Date(), new Date(ticket.updated_at));
  }

  private calculateTimeDifferenceInMinutes(endDate: Date, startDate: Date): number {
    return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60));
  }
}
