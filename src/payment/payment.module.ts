import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Payment } from './entities/payment.entity';
import { Checkout } from '../checkout/entities/checkout.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from '../ticket/entities/ticket.entity';
import { CompanySettingModule } from '../company-setting/company-setting.module';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Checkout, Ticket]), CompanySettingModule],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [TypeOrmModule, PaymentService],
})
export class PaymentModule {}
