import { Inject, Injectable } from '@nestjs/common';
import { Ticket, TicketAccessDenied } from '../domain/ticket';
import { TICKET_REPOSITORY, TicketRepository } from '../domain/ports/ticket.repository';
import { ResolveApiKeyCompanyUseCase } from './resolve-api-key-company.usecase';
import { UpdateTicketDto } from '../dto/update-ticket.dto';

@Injectable()
export class UpdateTicketUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY) private readonly tickets: TicketRepository,
    private readonly resolveCompany: ResolveApiKeyCompanyUseCase,
  ) {}

  async execute(id: number, dto: UpdateTicketDto, apiKey?: string): Promise<Ticket | null> {
    const companyId = await this.resolveCompany.execute(apiKey);
    const ticket = await this.tickets.findById(id, companyId);
    if (!ticket) throw new TicketAccessDenied();

    return this.tickets.update(ticket.id, {
      ticketNumber: dto.ticketNumber,
      licensePlate: dto.licensePlate,
      checkInTime: dto.checkInTime,
      paymentTime: dto.paymentTime,
      checkoutTime: dto.checkoutTime,
      status: dto.status,
    });
  }
}
