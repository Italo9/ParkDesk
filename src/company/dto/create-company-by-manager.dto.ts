import { IsString, IsBoolean, IsOptional, IsEmail, Length } from 'class-validator';
import { Column } from 'typeorm';

export class CreateCompanyByManagerDto {
  @IsString() @Length(1, 255) name: string;
  @IsString() @Length(14, 14) cnpj: string;
  @IsBoolean() active: boolean;
  @IsOptional() @IsString() peopleForContact?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsEmail() email?: string;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) created_at: Date;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) updated_at: Date;
}
