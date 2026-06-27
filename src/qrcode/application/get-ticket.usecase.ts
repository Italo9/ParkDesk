import { Inject, Injectable } from '@nestjs/common';
import { TicketNotFound, TicketRecord } from '../domain/qrcode';
import { TICKET_STORE, TicketStore } from '../domain/ports/ticket-store';

@Injectable()
export class GetTicketUseCase {
  constructor(@Inject(TICKET_STORE) private readonly tickets: TicketStore) {}

  async execute(id: number): Promise<TicketRecord> {
    const ticket = await this.tickets.findById(id);
    if (!ticket) throw new TicketNotFound(id);
    return ticket;
  }
}
