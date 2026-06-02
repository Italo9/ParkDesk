import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Company } from './../../company/entities/company.entity';
import { Qrcode } from '../../qrcode/entities/qrcode.entity';
import { Checkout } from '../../checkout/entities/checkout.entity';
import { TicketStatus } from '../enums/ticket-status.enum';

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn({ type: 'bigint' }) id: number;
  @Column() ticketNumber: number;
  @Column({ nullable: true }) licensePlate: string;
  @Column({ type: 'timestamptz' }) checkInTime: Date;
  @Column({ type: 'timestamptz', nullable: true }) paymentTime: Date;
  @Column({ type: 'timestamptz', nullable: true }) checkoutTime: Date;
  @Column({ type: 'enum', enum: TicketStatus, default: TicketStatus.OPEN }) status: TicketStatus;
  @ManyToOne(() => Company, (company) => company.tickets) @JoinColumn({ name: 'companyId' }) company: Company;
  @OneToMany(() => Qrcode, (qrcode) => qrcode.ticketId) qrcodes: Qrcode[];
  @OneToMany(() => Checkout, (checkout) => checkout.ticket) checkouts: Checkout[];
  @CreateDateColumn({ type: 'timestamptz' }) created_at: Date;
  @UpdateDateColumn({ type: 'timestamptz' }) updated_at: Date;
}
