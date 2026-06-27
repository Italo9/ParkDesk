import { Injectable } from '@nestjs/common';
import { TicketGateway } from '../../domain/ports/ticket-gateway';
import { TicketView } from '../../domain/pre-checkout';
import { FindTicketByNumberUseCase } from '../../../ticket/application/find-ticket-by-number.usecase';

@Injectable()
export class TicketGatewayAdapter implements TicketGateway {
  constructor(private readonly findTicketByNumber: FindTicketByNumberUseCase) {}

  async getByNumber(ticketNumber: number): Promise<TicketView | null> {
    const ticket = await this.findTicketByNumber.execute(ticketNumber);
    if (!ticket) return null;
    return {
      status: ticket.status,
      companyId: ticket.companyId,
      checkInTime: ticket.checkInTime,
      updatedAt: ticket.updatedAt as Date,
    };
  }
}
