import { Module } from '@nestjs/common';
import { TicketModule } from '../ticket/ticket.module';
import { CompanySettingModule } from '../company-setting/company-setting.module';
import { PreCheckoutController } from './infrastructure/http/pre-checkout.controller';
import { TicketGatewayAdapter } from './infrastructure/ticket/ticket.gateway.adapter';
import { SettingsGatewayAdapter } from './infrastructure/settings/settings.gateway.adapter';
import { TICKET_GATEWAY } from './domain/ports/ticket-gateway';
import { SETTINGS_GATEWAY } from './domain/ports/settings-gateway';
import { ProcessPreCheckoutUseCase } from './application/process-pre-checkout.usecase';

@Module({
  imports: [TicketModule, CompanySettingModule],
  controllers: [PreCheckoutController],
  providers: [
    { provide: TICKET_GATEWAY, useClass: TicketGatewayAdapter },
    { provide: SETTINGS_GATEWAY, useClass: SettingsGatewayAdapter },
    ProcessPreCheckoutUseCase,
  ],
})
export class PreCheckoutModule {}
