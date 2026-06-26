import { Injectable } from '@nestjs/common';
import { TicketGateway } from '../../domain/ports/ticket-gateway';
import { TicketView } from '../../domain/pre-checkout';
import { TicketService } from '../../../ticket/ticket.service';

@Injectable()
export class TicketGatewayAdapter implements TicketGateway {
  constructor(private readonly ticketService: TicketService) {}

  async getByNumber(ticketNumber: number): Promise<TicketView | null> {
    const ticket = await this.ticketService.findOneTicketNumber(ticketNumber);
    if (!ticket) return null;
    return {
      status: ticket.status,
      companyId: ticket.company.id,
      checkInTime: ticket.checkInTime,
      updatedAt: ticket.updated_at,
    };
  }
}
