import { TicketRecord, UpdateTicketRecord } from '../qrcode';

export const TICKET_STORE = Symbol('QRCODE_TICKET_STORE');

export interface TicketStore {
  findAll(): Promise<TicketRecord[]>;
  findById(id: number): Promise<TicketRecord | null>;
  update(id: number, patch: UpdateTicketRecord): Promise<TicketRecord | null>;
  deleteById(id: number): Promise<number>;
}
