import { Inject, Injectable } from '@nestjs/common';
import { TicketStatus } from '../enums/ticket-status.enum';
import { Ticket, TicketCompanyMissing } from '../domain/ticket';
import { generateTicketNumber } from '../domain/ticket-number';
import { TICKET_REPOSITORY, TicketRepository } from '../domain/ports/ticket.repository';
import { QRCODE_GATEWAY, QrcodeGateway } from '../domain/ports/qrcode-gateway';
import { CreateTicketDto } from '../dto/create-ticket.dto';

@Injectable()
export class CreateTicketUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY) private readonly tickets: TicketRepository,
    @Inject(QRCODE_GATEWAY) private readonly qrcode: QrcodeGateway,
  ) {}

  async execute(
    dto: CreateTicketDto,
    companyId: number | undefined,
  ): Promise<{ ticket: Ticket; qrCode: string }> {
    if (!companyId) throw new TicketCompanyMissing();

    const ticket = await this.tickets.create({
      licensePlate: dto.licensePlate,
      paymentTime: dto.paymentTime,
      checkoutTime: dto.checkoutTime,
      status: TicketStatus.OPEN,
      ticketNumber: generateTicketNumber(),
      companyId,
      checkInTime: dto.checkInTime || new Date(),
    });

    const qrCode = await this.qrcode.generateForTicket({
      id: ticket.id,
      ticketNumber: ticket.ticketNumber,
      checkInTime: ticket.checkInTime,
    });
    return { ticket, qrCode };
  }
}
