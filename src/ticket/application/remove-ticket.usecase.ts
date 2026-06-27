import { Inject, Injectable } from '@nestjs/common';
import { TicketAccessDenied } from '../domain/ticket';
import { TICKET_REPOSITORY, TicketRepository } from '../domain/ports/ticket.repository';
import { ResolveApiKeyCompanyUseCase } from './resolve-api-key-company.usecase';

@Injectable()
export class RemoveTicketUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY) private readonly tickets: TicketRepository,
    private readonly resolveCompany: ResolveApiKeyCompanyUseCase,
  ) {}

  async execute(id: number, apiKey?: string): Promise<void> {
    const companyId = await this.resolveCompany.execute(apiKey);
    const ticket = await this.tickets.findById(id, companyId);
    if (!ticket) throw new TicketAccessDenied();
    await this.tickets.deleteById(id);
  }
}
