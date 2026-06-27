import { Ticket } from '../../domain/ticket';
import { Ticket as TicketOrm } from '../../entities/ticket.entity';

export class TicketMapper {
  static toDomain(row: TicketOrm): Ticket {
    return new Ticket(
      Number(row.id),
      row.ticketNumber,
      row.licensePlate,
      row.checkInTime,
      row.paymentTime,
      row.checkoutTime,
      row.status,
      row.company?.id ?? 0,
      row.updated_at,
    );
  }
}
