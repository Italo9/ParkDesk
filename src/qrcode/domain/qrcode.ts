export const QR_SECRET_KEY = 'super_seguro';

export interface TicketSnapshot {
  id: number;
  ticketNumber: number;
  checkInTime: Date;
}

export interface TicketRecord {
  id: number;
  ticketNumber: number;
  licensePlate: string | null;
  checkInTime: Date;
  paymentTime: Date | null;
  checkoutTime: Date | null;
  status: string;
}

export interface UpdateTicketRecord {
  checkInTime?: Date;
  licensePlate?: string;
  paymentTime?: Date;
  checkoutTime?: Date;
  status?: string;
}

export class InvalidTicket extends Error {
  constructor() {
    super('Ticket invalido');
    this.name = 'InvalidTicket';
  }
}

export class TicketNotFound extends Error {
  constructor(id: number) {
    super(`Ticket with ID ${id} not found`);
    this.name = 'TicketNotFound';
  }
}

export class BaseUrlNotConfigured extends Error {
  constructor() {
    super('QR_CODE_BASE_URL nao configurado');
    this.name = 'BaseUrlNotConfigured';
  }
}
