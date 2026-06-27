import { Inject, Injectable } from '@nestjs/common';
import { TicketNotFound, TicketRecord } from '../domain/qrcode';
import { TICKET_STORE, TicketStore } from '../domain/ports/ticket-store';
import { TicketStatus } from '../../ticket/enums/ticket-status.enum';
import { UpdateQrcodeDto } from '../dto/update-qrcode.dto';

@Injectable()
export class UpdateTicketUseCase {
  constructor(@Inject(TICKET_STORE) private readonly tickets: TicketStore) {}

  async execute(id: number, dto: UpdateQrcodeDto): Promise<TicketRecord> {
    const status = dto.status
      ? TicketStatus[dto.status.toUpperCase() as keyof typeof TicketStatus]
      : undefined;

    const updated = await this.tickets.update(id, {
      checkInTime: dto.checkInTime,
      licensePlate: dto.licensePlate,
      paymentTime: dto.paymentTime,
      checkoutTime: dto.checkoutTime,
      status,
    });
    if (!updated) throw new TicketNotFound(id);
    return updated;
  }
}
