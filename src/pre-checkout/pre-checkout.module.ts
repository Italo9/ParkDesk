import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PreCheckoutController } from './pre-checkout.controller';
import { PreCheckoutService } from './pre-checkout.service';
import { TicketEntity } from './entities/ticket.entity';
import { TicketModule } from '../ticket/ticket.module';
import { CompanySettingService } from '../company-setting/company-setting.service';
import { CompanySetting } from '../company-setting/entities/company-setting.entity';
import { CompanySettingModule } from '../company-setting/company-setting.module';
import { ApiKeyService } from '../api_key/api-key.service';
import { ApiKeyModule } from '../api_key/api-key.module';
import { UserModule } from '../user/user.module';
import { CompanyModule } from '../company/company.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([TicketEntity, CompanySetting]), forwardRef(() => CompanyModule), TicketModule, CompanySettingModule, ApiKeyModule, UserModule, forwardRef(() => AuthModule)],
  controllers: [PreCheckoutController],
  providers: [PreCheckoutService, CompanySettingService, ApiKeyService],
  exports: [PreCheckoutService],
})
export class PreCheckoutModule {}
