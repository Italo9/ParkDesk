export const QRCODE_REPOSITORY = Symbol('QRCODE_REPOSITORY');

export interface SaveQrcodeData {
  internalQr: string;
  status: string;
  ticketId: number;
}

export interface QrcodeRepository {
  save(data: SaveQrcodeData): Promise<void>;
}
