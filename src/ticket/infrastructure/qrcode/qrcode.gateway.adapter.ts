import { Injectable } from '@nestjs/common';
import { QrcodeGateway, TicketSnapshot } from '../../domain/ports/qrcode-gateway';
import { GenerateQrCodeUseCase } from '../../../qrcode/application/generate-qr-code.usecase';

@Injectable()
export class QrcodeGatewayAdapter implements QrcodeGateway {
  constructor(private readonly generateQrCode: GenerateQrCodeUseCase) {}

  async generateForTicket(ticket: TicketSnapshot): Promise<string> {
    const result = await this.generateQrCode.execute({
      id: ticket.id,
      ticketNumber: ticket.ticketNumber,
      checkInTime: ticket.checkInTime,
    });
    return result.qrCode;
  }
}
