import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Ticket } from '../../ticket/entities/ticket.entity';

@Entity('QRCodes')
export class Qrcode {
  @PrimaryGeneratedColumn('increment') id: number;
  @Column({ type: 'varchar' }) internalQr: string;
  @Column({ type: 'varchar', nullable: true }) externalQr?: string;
  @Column({ type: 'varchar' }) status: string;
  @Column({ type: 'bigint' }) ticketId: number;
  @ManyToOne(() => Ticket, (ticket) => ticket.qrcodes) @JoinColumn({ name: 'id' }) ticket: Ticket;
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) created_at: Date;
  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) updated_at: Date;
}
