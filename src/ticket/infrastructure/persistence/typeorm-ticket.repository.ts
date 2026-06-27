import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from '../../domain/ticket';
import {
  CreateTicketData,
  TicketRepository,
  UpdateTicketData,
} from '../../domain/ports/ticket.repository';
import { Ticket as TicketOrm } from '../../entities/ticket.entity';
import { Company } from '../../../company/entities/company.entity';
import { TicketMapper } from './ticket.mapper';

@Injectable()
export class TypeOrmTicketRepository implements TicketRepository {
  constructor(
    @InjectRepository(TicketOrm) private readonly repo: Repository<TicketOrm>,
  ) {}

  async create(data: CreateTicketData): Promise<Ticket> {
    const entity = this.repo.create({
      licensePlate: data.licensePlate,
      paymentTime: data.paymentTime,
      checkoutTime: data.checkoutTime,
      status: data.status,
      ticketNumber: data.ticketNumber,
      company: { id: data.companyId } as Company,
      checkInTime: data.checkInTime,
    });
    const saved = await this.repo.save(entity);
    return TicketMapper.toDomain(saved);
  }

  async findAll(companyId: number | null): Promise<Ticket[]> {
    const rows = await this.repo.find({
      where: companyId ? { company: { id: companyId } } : {},
      relations: ['company'],
    });
    return rows.map(TicketMapper.toDomain);
  }

  async findById(id: number, companyId: number | null): Promise<Ticket | null> {
    const row = await this.repo.findOne({
      where: companyId ? { id, company: { id: companyId } } : { id },
      relations: ['company'],
    });
    return row ? TicketMapper.toDomain(row) : null;
  }

  async findByNumber(ticketNumber: number, companyId: number | null): Promise<Ticket | null> {
    const row = await this.repo.findOne({
      where: companyId ? { ticketNumber, company: { id: companyId } } : { ticketNumber },
      relations: ['company'],
    });
    return row ? TicketMapper.toDomain(row) : null;
  }

  async update(id: number, patch: UpdateTicketData): Promise<Ticket | null> {
    const fields: Partial<TicketOrm> = {};
    if (patch.ticketNumber !== undefined) fields.ticketNumber = patch.ticketNumber;
    if (patch.licensePlate !== undefined) fields.licensePlate = patch.licensePlate;
    if (patch.checkInTime !== undefined) fields.checkInTime = patch.checkInTime;
    if (patch.paymentTime !== undefined) fields.paymentTime = patch.paymentTime;
    if (patch.checkoutTime !== undefined) fields.checkoutTime = patch.checkoutTime;
    if (patch.status !== undefined) fields.status = patch.status;

    if (Object.keys(fields).length > 0) await this.repo.update(id, fields);

    const row = await this.repo.findOne({ where: { id }, relations: ['company'] });
    return row ? TicketMapper.toDomain(row) : null;
  }

  async deleteById(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
