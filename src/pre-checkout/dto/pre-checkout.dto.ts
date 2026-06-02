import { IsNotEmpty, IsString } from 'class-validator';

export class PreCheckoutDto {
  @IsNotEmpty() @IsString() qrCode: string;
}
