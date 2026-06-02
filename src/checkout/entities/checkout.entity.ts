import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Ticket } from './../../ticket/entities/ticket.entity';

@Entity('checkouts')
export class Checkout {
  @PrimaryGeneratedColumn('increment') id: number;
  @Column() url: string;
  @Column({ type: 'double precision', nullable: true }) valor: number;
  @Column() status: string;
  @ManyToOne(() => Ticket)
  @JoinColumn({ name: 'ticketId' }) ticket: Ticket;
  @CreateDateColumn({ type: 'timestamptz' }) created_at: Date;
  @UpdateDateColumn({ type: 'timestamptz' }) updated_at: Date;
}
