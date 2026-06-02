import { IsNotEmpty, IsNumber, IsOptional, IsString, IsDateString, IsEnum } from 'class-validator';
import { TicketStatus } from '../enums/ticket-status.enum';

export class CreateTicketDto {
  @IsNotEmpty() @IsNumber() ticketNumber?: number;
  @IsOptional() @IsString() licensePlate?: string;
  @IsNotEmpty() @IsDateString() checkInTime: Date;
  @IsOptional() @IsDateString() paymentTime?: Date;
  @IsOptional() @IsDateString() checkoutTime?: Date;
  @IsNotEmpty() @IsEnum(TicketStatus) status: TicketStatus;
  @IsNotEmpty() @IsNumber() companyId?: number;
}
