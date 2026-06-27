import { Injectable } from '@nestjs/common';
import { TicketGateway, TicketRef } from '../../domain/ports/ticket-gateway';
import { UpdateTicketUseCase } from '../../../ticket/application/update-ticket.usecase';
import { FindTicketByNumberUseCase } from '../../../ticket/application/find-ticket-by-number.usecase';

@Injectable()
export class TicketGatewayAdapter implements TicketGateway {
  constructor(
    private readonly updateTicket: UpdateTicketUseCase,
    private readonly findTicketByNumber: FindTicketByNumberUseCase,
  ) {}

  async setCheckoutTime(ticketCode: number, checkoutTime: string): Promise<void> {
    await this.updateTicket.execute(ticketCode, { checkoutTime: checkoutTime as unknown as Date });
  }

  async findByNumber(ticketNumber: number): Promise<TicketRef | null> {
    const ticket = await this.findTicketByNumber.execute(ticketNumber);
    if (!ticket) return null;
    return { id: ticket.id, companyId: ticket.companyId };
  }
}
