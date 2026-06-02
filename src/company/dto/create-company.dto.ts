import { IsString, IsBoolean, IsOptional, IsEmail, Length, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserDto } from './../../user/dto/create-user.dto';
import { Column } from 'typeorm';

export class CreateCompanyDto {
  @IsString() @Length(1, 255) name: string;
  @IsString() @Length(14, 14) cnpj: string;
  @IsBoolean() active: boolean;
  @IsOptional() @IsString() peopleForContact?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsEmail() email?: string;
  @ValidateNested() @Type(() => CreateUserDto) user: CreateUserDto;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) created_at: Date;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) updated_at: Date;
}
