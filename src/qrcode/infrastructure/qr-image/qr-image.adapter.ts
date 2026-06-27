import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as QRCode from 'qrcode';
import { QrImage } from '../../domain/ports/qr-image';
import { BaseUrlNotConfigured } from '../../domain/qrcode';

@Injectable()
export class QrImageAdapter implements QrImage {
  constructor(private readonly config: ConfigService) {}

  async render(ticketNumber: number): Promise<string> {
    const baseUrl = this.config.get<string>('QR_CODE_BASE_URL');
    if (!baseUrl) throw new BaseUrlNotConfigured();
    return QRCode.toDataURL(`${baseUrl}/${ticketNumber}`);
  }
}
