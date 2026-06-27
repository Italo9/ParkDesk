import { Inject, Injectable } from '@nestjs/common';
import { InvalidTicket, TicketSnapshot } from '../domain/qrcode';
import { QRCODE_REPOSITORY, QrcodeRepository } from '../domain/ports/qrcode.repository';
import { QR_IMAGE, QrImage } from '../domain/ports/qr-image';

@Injectable()
export class GenerateQrCodeUseCase {
  constructor(
    @Inject(QRCODE_REPOSITORY) private readonly qrcodes: QrcodeRepository,
    @Inject(QR_IMAGE) private readonly qrImage: QrImage,
  ) {}

  async execute(ticket: TicketSnapshot): Promise<{ qrCode: string }> {
    if (!ticket) throw new InvalidTicket();
    const internalQr = await this.qrImage.render(ticket.ticketNumber);
    await this.qrcodes.save({ internalQr, status: 'active', ticketId: ticket.id });
    return { qrCode: internalQr };
  }
}
