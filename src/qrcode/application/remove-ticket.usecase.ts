import { Inject, Injectable } from '@nestjs/common';
import { TicketNotFound } from '../domain/qrcode';
import { TICKET_STORE, TicketStore } from '../domain/ports/ticket-store';

@Injectable()
export class RemoveTicketUseCase {
  constructor(@Inject(TICKET_STORE) private readonly tickets: TicketStore) {}

  async execute(id: number): Promise<void> {
    const affected = await this.tickets.deleteById(id);
    if (affected === 0) throw new TicketNotFound(id);
  }
}
