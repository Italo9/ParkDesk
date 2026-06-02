import { IsBoolean, IsNumber, IsObject, IsString } from 'class-validator';

export class CreateCompanySettingDto {
  @IsNumber() ValueHour: number;
  @IsNumber() ValueFractionHour: number;
  @IsBoolean() autorecharge: boolean;
  @IsString() timeTolerance: string;
  @IsNumber() pixExpirationTime: number;
  @IsObject() gateway: Record<string, any>;
  @IsNumber() companyId: number;
}
