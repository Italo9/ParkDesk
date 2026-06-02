import { IsNotEmpty, IsNumber, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateQrcodeDto {
  @IsNotEmpty() @IsDateString() checkInTime?: Date;
  @IsOptional() @IsString() licensePlate?: string;
  @IsNotEmpty() @IsNumber() companyId: number;
  @IsOptional() @IsDateString() paymentTime?: Date;
  @IsNotEmpty() @IsString() status: string;
  @IsOptional() @IsDateString() checkoutTime?: Date;
}
