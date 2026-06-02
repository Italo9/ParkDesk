import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from '../ticket/entities/ticket.entity';
import { Qrcode } from '../qrcode/entities/qrcode.entity';
import { CreateQrcodeDto } from './dto/create-qrcode.dto';
import * as QRCode from 'qrcode';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { TicketStatus } from '../ticket/enums/ticket-status.enum';

@Injectable()
export class QrcodeService {
  private readonly secretKey = 'super_seguro';

  constructor(
    @InjectRepository(Ticket) private ticketRepository: Repository<Ticket>,
    @InjectRepository(Qrcode) private qrcodeRepository: Repository<Qrcode>,
    private configService: ConfigService,
  ) {}

  async generateQrCode(ticket: Ticket): Promise<{ qrCode: string }> {
    if (!ticket) throw new Error('Ticket inválido');

    const qrCodeData = JSON.stringify({ ticketNumber: ticket.ticketNumber, checkInTime: ticket.checkInTime });
    crypto.createHmac('sha256', this.secretKey).update(qrCodeData).digest('hex');

    const baseUrl = this.configService.get<string>('QR_CODE_BASE_URL');
    if (!baseUrl) throw new Error('QR_CODE_BASE_URL não configurado');

    const qrCodeUrl = await QRCode.toDataURL(`${baseUrl}/${ticket.ticketNumber}`);
    const qrCode = this.qrcodeRepository.create({ internalQr: qrCodeUrl, status: 'active', ticketId: ticket.id });
    await this.qrcodeRepository.save(qrCode);
    return { qrCode: qrCode.internalQr };
  }

  async validateQrCode(qrCodeContent: string): Promise<boolean> {
    try {
      const { qrCodeData, hash } = JSON.parse(qrCodeContent);
      const recalculatedHash = crypto.createHmac('sha256', this.secretKey).update(qrCodeData).digest('hex');
      return hash === recalculatedHash;
    } catch (error) {
      console.error('QR Code validation failed:', error);
      return false;
    }
  }

  async findAll(): Promise<Ticket[]> { return this.ticketRepository.find(); }

  async findOne(id: number): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOneBy({ id });
    if (!ticket) throw new Error(`Ticket with ID ${id} not found`);
    return ticket;
  }

  async update(id: number, updateQrcodeDto: Partial<CreateQrcodeDto>): Promise<Ticket> {
    const updateData = { ...updateQrcodeDto, status: updateQrcodeDto.status ? TicketStatus[updateQrcodeDto.status.toUpperCase() as keyof typeof TicketStatus] : undefined };
    await this.ticketRepository.update(id, updateData);
    const updatedTicket = await this.ticketRepository.findOneBy({ id });
    if (!updatedTicket) throw new Error(`Ticket with ID ${id} not found`);
    return updatedTicket;
  }

  async remove(id: number): Promise<void> {
    const result = await this.ticketRepository.delete(id);
    if (result.affected === 0) throw new Error(`Ticket with ID ${id} not found`);
  }
}
