import { Injectable } from '@nestjs/common';
import { TicketGateway, TicketView } from '../../domain/ports/ticket-gateway';
import { FindTicketByIdUseCase } from '../../../ticket/application/find-ticket-by-id.usecase';
import { UpdateTicketUseCase } from '../../../ticket/application/update-ticket.usecase';
import { TicketStatus } from '../../../ticket/enums/ticket-status.enum';

@Injectable()
export class TicketGatewayAdapter implements TicketGateway {
  constructor(
    private readonly findTicketById: FindTicketByIdUseCase,
    private readonly updateTicket: UpdateTicketUseCase,
  ) {}

  async findById(id: number): Promise<TicketView | null> {
    const ticket = await this.findTicketById.execute(id);
    if (!ticket) return null;
    return {
      id: ticket.id,
      status: ticket.status,
      checkoutTime: ticket.checkoutTime,
      companyId: ticket.companyId,
    };
  }

  async close(ticketId: number): Promise<void> {
    await this.updateTicket.execute(ticketId, { status: TicketStatus.CLOSED });
  }
}
