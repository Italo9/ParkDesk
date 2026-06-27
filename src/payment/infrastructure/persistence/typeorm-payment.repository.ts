import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateForCheckoutData,
  PaymentRepository,
  SaveDifferentialData,
} from '../../domain/ports/payment.repository';
import { Payment } from '../../entities/payment.entity';
import { Ticket } from '../../../ticket/entities/ticket.entity';
import { Checkout } from '../../../checkout/entities/checkout.entity';

@Injectable()
export class TypeOrmPaymentRepository implements PaymentRepository {
  constructor(@InjectRepository(Payment) private readonly repo: Repository<Payment>) {}

  async saveDifferential(data: SaveDifferentialData): Promise<void> {
    const payment = this.repo.create({
      ticket: { id: data.ticketId } as Ticket,
      value: data.value,
      paymentMethod: data.paymentMethod,
    });
    await this.repo.save(payment);
  }

  async existsByCheckoutId(checkoutId: number): Promise<boolean> {
    const found = await this.repo.findOne({ where: { checkout: { id: checkoutId } } });
    return !!found;
  }

  async createForCheckout(data: CreateForCheckoutData): Promise<void> {
    const payment = this.repo.create({
      checkout: { id: data.checkoutId } as Checkout,
      paymentMethod: data.paymentMethod,
      paymentDate: data.paymentDate,
      value: data.value,
    });
    await this.repo.save(payment);
  }
}
