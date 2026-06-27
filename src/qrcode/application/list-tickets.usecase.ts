import { Inject, Injectable } from '@nestjs/common';
import { TicketRecord } from '../domain/qrcode';
import { TICKET_STORE, TicketStore } from '../domain/ports/ticket-store';

@Injectable()
export class ListTicketsUseCase {
  constructor(@Inject(TICKET_STORE) private readonly tickets: TicketStore) {}

  execute(): Promise<TicketRecord[]> {
    return this.tickets.findAll();
  }
}
