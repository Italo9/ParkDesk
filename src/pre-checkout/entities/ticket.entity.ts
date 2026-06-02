import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('tickets')
export class TicketEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column() qrCode: string;
  @CreateDateColumn() entryTime: Date;
  @Column() hourlyRate: number;
}
