import { Checkout } from '../../checkout/entities/checkout.entity';
import { Ticket } from '../../ticket/entities/ticket.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('increment') id: number;
  @Column({ length: 50 }) paymentMethod: string;
  @Column({ type: 'double precision' }) value: number;
  @Column({ nullable: true }) repayment: boolean;
  @Column({ type: 'timestamptz' }) paymentDate: Date;
  @ManyToOne(() => Checkout) @JoinColumn({ name: 'checkoutId' }) checkout: Checkout;
  @ManyToOne(() => Ticket) @JoinColumn({ name: 'id' }) ticket: Ticket;
  @CreateDateColumn({ type: 'timestamptz' }) created_at: Date;
  @UpdateDateColumn({ type: 'timestamptz' }) updated_at: Date;
}
