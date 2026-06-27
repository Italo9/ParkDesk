export const QRCODE_GATEWAY = Symbol('TICKET_QRCODE_GATEWAY');

export interface TicketSnapshot {
  id: number;
  ticketNumber: number;
  checkInTime: Date;
}

export interface QrcodeGateway {
  generateForTicket(ticket: TicketSnapshot): Promise<string>;
}
