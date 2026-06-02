import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { Ticket } from '../ticket/entities/ticket.entity';
import { QrcodeController } from './qrcode.controller';
import { QrcodeService } from './qrcode.service';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { Company } from '../company/entities/company.entity';
import { Qrcode } from './entities/qrcode.entity';
import { TicketModule } from '../ticket/ticket.module';
import { CompanySettingModule } from '../company-setting/company-setting.module';
import { CheckoutModule } from '@/checkout/checkout.module';

@Module({
  imports: [TypeOrmModule.forFeature([Qrcode, Ticket, Company]), forwardRef(() => AuthModule), forwardRef(() => UserModule), forwardRef(() => TicketModule), forwardRef(() => CompanySettingModule), forwardRef(() => CheckoutModule)],
  controllers: [QrcodeController],
  providers: [QrcodeService],
  exports: [QrcodeService],
})
export class QrcodeModule {}
