import { ForbiddenException, Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket } from './entities/ticket.entity';
import * as crypto from 'crypto';
import { REQUEST } from '@nestjs/core';
import { AuthRequest } from '../auth/guards/auth.guard';
import { TicketStatus } from './enums/ticket-status.enum';
import { ApiKeyService } from '@/api_key/api-key.service';
import { ApiKey } from '@/api_key/entities/api-key.entity';
import { QrcodeService } from '@/qrcode/qrcode.service';

interface TicketResponse { ticket: Ticket; qrCode: string; }

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket) private ticketRepository: Repository<Ticket>,
    private readonly apiKeyService: ApiKeyService,
    private readonly qrcodeService: QrcodeService,
    @Inject(REQUEST) private readonly request: AuthRequest,
  ) {}

  private getCompanyId(): number {
    if (!this.request.companyId) throw new ForbiddenException('Company ID não encontrado');
    return this.request.companyId;
  }

  async create(createTicketDto: CreateTicketDto): Promise<TicketResponse> {
    const companyId = this.getCompanyId();
    if (!companyId) throw new ForbiddenException('É necessário informar a empresa.');

    const timestamp = Date.now().toString();
    const randomValue = Math.random().toString();
    const hashTicketNumber = parseInt(crypto.createHash('md5').update(timestamp + randomValue).digest('hex').substring(0, 10), 16);

    const ticket = this.ticketRepository.create({
      ...createTicketDto,
      status: TicketStatus.OPEN,
      ticketNumber: hashTicketNumber,
      company: { id: companyId },
      checkInTime: createTicketDto.checkInTime || new Date(),
    });

    const savedTicket = await this.ticketRepository.save(ticket);
    const { qrCode } = await this.qrcodeService.generateQrCode(savedTicket);
    return { ticket: savedTicket, qrCode };
  }

  async findAll(apiKey?: string): Promise<Ticket[]> {
    let companyId: number | null = null;
    if (apiKey) {
      const entity = await this.apiKeyService.findApiKey(apiKey);
      if (!entity || !entity.company) throw new ForbiddenException('Empresa não encontrada para esta API Key.');
      companyId = entity.company.id;
    }
    return this.ticketRepository.find({ where: companyId ? { company: { id: companyId } } : {}, relations: ['company'] });
  }

  async findOne(id: number, apiKey?: string): Promise<Ticket | null> {
    let companyId: number | null = null;
    if (apiKey) {
      const entity = await this.apiKeyService.findApiKey(apiKey);
      if (!entity || !entity.company) throw new ForbiddenException('Empresa não encontrada para esta API Key.');
      companyId = entity.company.id;
    }
    return this.ticketRepository.findOne({ where: companyId ? { id, company: { id: companyId } } : { id }, relations: ['company'] });
  }

  async findOneTicketNumber(ticketNumber: number, apiKey?: string): Promise<Ticket | null> {
    let companyId: number | null = null;
    if (apiKey) {
      const entity = await this.apiKeyService.findApiKey(apiKey);
      if (!entity || !entity.company) throw new ForbiddenException('Empresa não encontrada para esta API Key.');
      companyId = entity.company.id;
    }
    return this.ticketRepository.findOne({ where: companyId ? { ticketNumber, company: { id: companyId } } : { ticketNumber }, relations: ['company'] });
  }

  async update(id: number, updateTicketDto: UpdateTicketDto, apiKey?: string): Promise<Ticket | null> {
    let companyId: number | null = null;
    if (apiKey) {
      const entity = await this.apiKeyService.findApiKey(apiKey);
      if (!entity || !entity.company) throw new ForbiddenException('Empresa não encontrada para esta API Key.');
      companyId = entity.company.id;
    }
    const ticket = await this.ticketRepository.findOne({ where: companyId ? { id, company: { id: companyId } } : { id } });
    if (!ticket) throw new ForbiddenException('Ticket não encontrado ou não pertencente à sua empresa.');
    await this.ticketRepository.update(ticket.id, updateTicketDto);
    return this.ticketRepository.findOne({ where: { id: ticket.id } });
  }

  async remove(id: number, apiKey?: string): Promise<void> {
    let companyId: number | null = null;
    if (apiKey) {
      const entity = await this.apiKeyService.findApiKey(apiKey);
      if (!entity || !entity.company) throw new ForbiddenException('Empresa não encontrada para esta API Key.');
      companyId = entity.company.id;
    }
    const ticket = await this.ticketRepository.findOne({ where: companyId ? { id, company: { id: companyId } } : { id }, relations: ['company'] });
    if (!ticket) throw new ForbiddenException('Ticket não encontrado ou não pertencente à sua empresa.');
    await this.ticketRepository.delete(id);
  }
}
