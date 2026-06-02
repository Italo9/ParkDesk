import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckoutService } from './checkout.service';
import { CheckoutController } from './checkout.controller';
import { Checkout } from './entities/checkout.entity';
import { AuthGatewayService } from '../auth/auth-gateway.service';
import { TicketService } from '../ticket/ticket.service';
import { Ticket } from '../ticket/entities/ticket.entity';
import { WebhookService } from '../webhook/webhook.service';
import { CompanySettingService } from '../company-setting/company-setting.service';
import { CompanySetting } from '../company-setting/entities/company-setting.entity';
import { PaymentModule } from '../payment/payment.module';
import { UserModule } from '../user/user.module';
import { CompanyModule } from '../company/company.module';
import { ApiKeyModule } from '../api_key/api-key.module';
import { QrcodeModule } from '@/qrcode/qrcode.module';

@Module({
  imports: [TypeOrmModule.forFeature([Checkout, Ticket, CompanySetting]), forwardRef(() => QrcodeModule), forwardRef(() => PaymentModule), forwardRef(() => ApiKeyModule), forwardRef(() => UserModule), forwardRef(() => CompanyModule)],
  controllers: [CheckoutController],
  providers: [CheckoutService, AuthGatewayService, TicketService, WebhookService, CompanySettingService],
  exports: [TypeOrmModule, CheckoutService],
})
export class CheckoutModule {}
