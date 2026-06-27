import { TicketStatus } from '../../enums/ticket-status.enum';
import { Ticket } from '../ticket';

export const TICKET_REPOSITORY = Symbol('TICKET_REPOSITORY');

export interface CreateTicketData {
  licensePlate?: string;
  paymentTime?: Date;
  checkoutTime?: Date;
  status: TicketStatus;
  ticketNumber: number;
  companyId: number;
  checkInTime: Date;
}

export interface UpdateTicketData {
  ticketNumber?: number;
  licensePlate?: string;
  checkInTime?: Date;
  paymentTime?: Date;
  checkoutTime?: Date;
  status?: TicketStatus;
}

export interface TicketRepository {
  create(data: CreateTicketData): Promise<Ticket>;
  findAll(companyId: number | null): Promise<Ticket[]>;
  findById(id: number, companyId: number | null): Promise<Ticket | null>;
  findByNumber(ticketNumber: number, companyId: number | null): Promise<Ticket | null>;
  update(id: number, patch: UpdateTicketData): Promise<Ticket | null>;
  deleteById(id: number): Promise<void>;
}
