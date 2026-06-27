export const QR_IMAGE = Symbol('QRCODE_QR_IMAGE');

export interface QrImage {
  render(ticketNumber: number): Promise<string>;
}
