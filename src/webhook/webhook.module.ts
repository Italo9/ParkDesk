import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckoutService } from '../checkout/checkout.service';
import { CheckoutController } from '../checkout/checkout.controller';
import { Checkout } from '../checkout/entities/checkout.entity';
import { AuthGatewayService } from '../auth/auth-gateway.service';
import { TicketService } from '../ticket/ticket.service';
import { Ticket } from '../ticket/entities/ticket.entity';
import { WebhookService } from './webhook.service';
import { CompanySettingModule } from '../company-setting/company-setting.module';
import { CheckoutModule } from '../checkout/checkout.module';
import { PaymentModule } from '../payment/payment.module';
import { Payment } from '../payment/entities/payment.entity';
import { ApiKeyModule } from '../api_key/api-key.module';
import { QrcodeModule } from '@/qrcode/qrcode.module';

@Module({
  imports: [TypeOrmModule.forFeature([Checkout, Ticket, Payment]), forwardRef(() => QrcodeModule), forwardRef(() => CompanySettingModule), forwardRef(() => CheckoutModule), forwardRef(() => ApiKeyModule), forwardRef(() => PaymentModule)],
  controllers: [CheckoutController],
  providers: [CheckoutService, AuthGatewayService, TicketService, WebhookService],
  exports: [TypeOrmModule, WebhookService],
})
export class WebhookModule {}
