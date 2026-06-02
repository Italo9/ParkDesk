import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { Checkout } from '../checkout/entities/checkout.entity';
import { Ticket } from '../ticket/entities/ticket.entity';
import { CompanySettingService } from '../company-setting/company-setting.service';
import { TicketStatus } from '../ticket/enums/ticket-status.enum';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment) private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Checkout) private readonly checkoutRepository: Repository<Checkout>,
    @InjectRepository(Ticket) private readonly ticketRepository: Repository<Ticket>,
    private readonly companySettingService: CompanySettingService,
  ) {}

  async processDifferentialPayment(ticketId: number, companyId: number) {
    const ticket = await this.ticketRepository.findOne({ where: { id: ticketId }, relations: ['checkout'] });
    if (!ticket || ticket.status === TicketStatus.PAID) throw new NotFoundException('Ticket não encontrado ou já PAID');

    const companySetting = await this.companySettingService.findOneByCompanyId(companyId);
    if (!companySetting || !companySetting.autorecharge) throw new BadRequestException('Pagamento diferencial não está disponível');

    const currentDate = new Date();
    const exitTime = ticket.checkoutTime;
    if (currentDate <= exitTime) throw new BadRequestException('Tempo de tolerância não foi excedido');

    const additionalTime = currentDate.getTime() - exitTime.getTime();
    const additionalHours = Math.ceil(additionalTime / (1000 * 3600));
    const additionalValue = additionalHours * companySetting.ValueHour;

    const differentialPayment = new Payment();
    differentialPayment.ticket = ticket;
    differentialPayment.value = additionalValue;
    differentialPayment.paymentMethod = 'PIX';
    await this.paymentRepository.save(differentialPayment);

    return { qrCode: `pix://pay?value=${additionalValue}&ticketId=${ticket.id}`, message: 'Pagamento diferencial gerado com sucesso!' };
  }

  async processPayment(checkoutId: number, paymentDetails: any) {
    const checkout = await this.checkoutRepository.findOne({ where: { id: checkoutId }, relations: ['ticket'] });
    if (!checkout) throw new NotFoundException('Checkout não encontrado');

    let payment = await this.paymentRepository.findOne({ where: { checkout: { id: checkoutId } } });
    if (!payment) {
      payment = this.paymentRepository.create({
        checkout: { id: checkoutId },
        paymentMethod: paymentDetails.allowed_methods,
        paymentDate: paymentDetails.payments[0].created_at,
        value: paymentDetails.payments[0].amount.amount,
      });
    }
    await this.paymentRepository.save(payment);
  }

  async closeTicket(checkoutId: number) {
    const checkout = await this.checkoutRepository.findOne({ where: { id: checkoutId }, relations: ['ticket'] });
    if (!checkout) throw new NotFoundException('Checkout não encontrado');
    const ticket = checkout.ticket;
    if (!ticket) throw new NotFoundException('Ticket não encontrado');
    ticket.status = TicketStatus.CLOSED;
    await this.ticketRepository.save(ticket);
  }
}
