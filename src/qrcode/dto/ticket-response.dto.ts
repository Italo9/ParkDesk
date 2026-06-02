export class TicketResponseDto {
  id?: number;
  ticketNumber?: number;
  licensePlate?: string;
  checkInTime?: Date;
  paymentTime?: Date;
  checkoutTime?: Date;
  status?: string;
  companyId?: number;
  qrCode: string;
  qrCodeId?: number;
  created_at?: Date;
  updated_at?: Date;
}
