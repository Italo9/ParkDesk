import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Checkout } from '../../domain/checkout';
import { CheckoutRepository, SaveCheckoutData } from '../../domain/ports/checkout.repository';
import { Checkout as CheckoutOrm } from '../../entities/checkout.entity';
import { Ticket } from '../../../ticket/entities/ticket.entity';
import { CheckoutMapper } from './checkout.mapper';

@Injectable()
export class TypeOrmCheckoutRepository implements CheckoutRepository {
  constructor(@InjectRepository(CheckoutOrm) private readonly repo: Repository<CheckoutOrm>) {}

  async save(data: SaveCheckoutData): Promise<void> {
    await this.repo.save({
      url: data.url,
      valor: data.valor,
      status: data.status,
      ticket: { id: data.ticketId } as Ticket,
    });
  }

  async findByTicketId(ticketId: number): Promise<Checkout | null> {
    const row = await this.repo.findOne({
      where: { ticket: { id: ticketId } },
      relations: ['ticket'],
    });
    return row ? CheckoutMapper.toDomain(row) : null;
  }

  async findById(id: number): Promise<Checkout | null> {
    const row = await this.repo.findOne({ where: { id } });
    return row ? CheckoutMapper.toDomain(row) : null;
  }

  async updateStatus(id: number, status: string): Promise<void> {
    await this.repo.update(id, { status });
  }
}
