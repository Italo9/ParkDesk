export interface TicketView {
  status: string;
  companyId: number;
  checkInTime: Date;
  updatedAt: Date;
}

export interface SettingsView {
  valueHour: number;
  valueFractionHour: number;
}

export interface ParkingCalculationResult {
  duration: string;
  amountDue: string;
}

export interface PaymentStatusResult {
  message: string;
  amountDue?: number;
}

export class TicketNotFound extends Error {
  constructor(ticketNumber: number) {
    super(`Ticket com No ${ticketNumber} nao encontrado`);
    this.name = 'TicketNotFound';
  }
}

export class CompanySettingNotFound extends Error {
  constructor(companyId: number) {
    super(`Configuracao da empresa ID ${companyId} nao encontrada`);
    this.name = 'CompanySettingNotFound';
  }
}

export class InvalidTicketStatus extends Error {
  constructor() {
    super('Status do ticket invalido');
    this.name = 'InvalidTicketStatus';
  }
}
