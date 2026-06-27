import { Injectable } from '@nestjs/common';
import { QrcodeGateway, TicketSnapshot } from '../../domain/ports/qrcode-gateway';
import { QrcodeService } from '../../../qrcode/qrcode.service';
import { Ticket } from '../../entities/ticket.entity';

@Injectable()
export class QrcodeGatewayAdapter implements QrcodeGateway {
  constructor(private readonly qrcodeService: QrcodeService) {}

  async generateForTicket(ticket: TicketSnapshot): Promise<string> {
    const result = await this.qrcodeService.generateQrCode({
      id: ticket.id,
      ticketNumber: ticket.ticketNumber,
      checkInTime: ticket.checkInTime,
    } as Ticket);
    return result.qrCode;
  }
}
