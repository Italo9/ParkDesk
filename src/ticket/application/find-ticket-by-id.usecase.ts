import { Inject, Injectable } from '@nestjs/common';
import { Ticket } from '../domain/ticket';
import { TICKET_REPOSITORY, TicketRepository } from '../domain/ports/ticket.repository';
import { ResolveApiKeyCompanyUseCase } from './resolve-api-key-company.usecase';

@Injectable()
export class FindTicketByIdUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY) private readonly tickets: TicketRepository,
    private readonly resolveCompany: ResolveApiKeyCompanyUseCase,
  ) {}

  async execute(id: number, apiKey?: string): Promise<Ticket | null> {
    const companyId = await this.resolveCompany.execute(apiKey);
    return this.tickets.findById(id, companyId);
  }
}
