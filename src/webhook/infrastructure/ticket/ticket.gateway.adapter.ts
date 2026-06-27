import { Injectable } from '@nestjs/common';
import { TicketGateway } from '../../domain/ports/ticket-gateway';
import { UpdateTicketUseCase } from '../../../ticket/application/update-ticket.usecase';
import { TicketStatus } from '../../../ticket/enums/ticket-status.enum';

@Injectable()
export class TicketGatewayAdapter implements TicketGateway {
  constructor(private readonly updateTicket: UpdateTicketUseCase) {}

  async markPaid(ticketNumber: number, paymentTime: string): Promise<void> {
    await this.updateTicket.execute(ticketNumber, {
      paymentTime: paymentTime as unknown as Date,
      status: TicketStatus.PAID,
    });
  }
}
