import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TicketRecord, UpdateTicketRecord } from '../../domain/qrcode';
import { TicketStore } from '../../domain/ports/ticket-store';
import { Ticket } from '../../../ticket/entities/ticket.entity';
import { TicketStatus } from '../../../ticket/enums/ticket-status.enum';

function toRecord(row: Ticket): TicketRecord {
  return {
    id: Number(row.id),
    ticketNumber: row.ticketNumber,
    licensePlate: row.licensePlate ?? null,
    checkInTime: row.checkInTime,
    paymentTime: row.paymentTime ?? null,
    checkoutTime: row.checkoutTime ?? null,
    status: row.status,
  };
}

@Injectable()
export class TicketStoreAdapter implements TicketStore {
  constructor(@InjectRepository(Ticket) private readonly repo: Repository<Ticket>) {}

  async findAll(): Promise<TicketRecord[]> {
    const rows = await this.repo.find();
    return rows.map(toRecord);
  }

  async findById(id: number): Promise<TicketRecord | null> {
    const row = await this.repo.findOneBy({ id });
    return row ? toRecord(row) : null;
  }

  async update(id: number, patch: UpdateTicketRecord): Promise<TicketRecord | null> {
    const fields: Partial<Ticket> = {};
    if (patch.checkInTime !== undefined) fields.checkInTime = patch.checkInTime;
    if (patch.licensePlate !== undefined) fields.licensePlate = patch.licensePlate;
    if (patch.paymentTime !== undefined) fields.paymentTime = patch.paymentTime;
    if (patch.checkoutTime !== undefined) fields.checkoutTime = patch.checkoutTime;
    if (patch.status !== undefined) fields.status = patch.status as TicketStatus;

    if (Object.keys(fields).length > 0) await this.repo.update(id, fields);

    const row = await this.repo.findOneBy({ id });
    return row ? toRecord(row) : null;
  }

  async deleteById(id: number): Promise<number> {
    const result = await this.repo.delete(id);
    return result.affected ?? 0;
  }
}
