import { TicketStatus } from '../enums/ticket-status.enum';

export class Ticket {
  constructor(
    public readonly id: number,
    public readonly ticketNumber: number,
    public readonly licensePlate: string | undefined,
    public readonly checkInTime: Date,
    public readonly paymentTime: Date | undefined,
    public readonly checkoutTime: Date | undefined,
    public readonly status: TicketStatus,
    public readonly companyId: number,
    public readonly updatedAt: Date | undefined,
  ) {}
}

export class TicketCompanyMissing extends Error {
  constructor() {
    super('Company ID nao encontrado');
    this.name = 'TicketCompanyMissing';
  }
}

export class TicketAccessDenied extends Error {
  constructor() {
    super('Ticket nao encontrado ou nao pertencente a sua empresa.');
    this.name = 'TicketAccessDenied';
  }
}

export class ApiKeyCompanyMissing extends Error {
  constructor() {
    super('Empresa nao encontrada para esta API Key.');
    this.name = 'ApiKeyCompanyMissing';
  }
}
