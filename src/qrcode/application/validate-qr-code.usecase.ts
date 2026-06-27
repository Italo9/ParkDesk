import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { QR_SECRET_KEY } from '../domain/qrcode';

@Injectable()
export class ValidateQrCodeUseCase {
  execute(qrCodeContent: string): boolean {
    try {
      const { qrCodeData, hash } = JSON.parse(qrCodeContent);
      const recalculated = crypto
        .createHmac('sha256', QR_SECRET_KEY)
        .update(qrCodeData)
        .digest('hex');
      return hash === recalculated;
    } catch (error) {
      console.error('QR Code validation failed:', error);
      return false;
    }
  }
}
