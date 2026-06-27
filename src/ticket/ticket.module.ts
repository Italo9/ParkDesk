import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { AuthModule } from '../auth/auth.module';
import { ApiKeyModule } from '../api_key/api-key.module';
import { QrcodeModule } from '@/qrcode/qrcode.module';
import { TicketController } from './infrastructure/http/ticket.controller';
import { TypeOrmTicketRepository } from './infrastructure/persistence/typeorm-ticket.repository';
import { ApiKeyGatewayAdapter } from './infrastructure/api-key/api-key.gateway.adapter';
import { QrcodeGatewayAdapter } from './infrastructure/qrcode/qrcode.gateway.adapter';
import { TICKET_REPOSITORY } from './domain/ports/ticket.repository';
import { API_KEY_GATEWAY } from './domain/ports/api-key-gateway';
import { QRCODE_GATEWAY } from './domain/ports/qrcode-gateway';
import { ResolveApiKeyCompanyUseCase } from './application/resolve-api-key-company.usecase';
import { CreateTicketUseCase } from './application/create-ticket.usecase';
import { FindAllTicketsUseCase } from './application/find-all-tickets.usecase';
import { FindTicketByIdUseCase } from './application/find-ticket-by-id.usecase';
import { FindTicketByNumberUseCase } from './application/find-ticket-by-number.usecase';
import { UpdateTicketUseCase } from './application/update-ticket.usecase';
import { RemoveTicketUseCase } from './application/remove-ticket.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket]),
    forwardRef(() => AuthModule),
    forwardRef(() => ApiKeyModule),
    forwardRef(() => QrcodeModule),
  ],
  controllers: [TicketController],
  providers: [
    { provide: TICKET_REPOSITORY, useClass: TypeOrmTicketRepository },
    { provide: API_KEY_GATEWAY, useClass: ApiKeyGatewayAdapter },
    { provide: QRCODE_GATEWAY, useClass: QrcodeGatewayAdapter },
    ResolveApiKeyCompanyUseCase,
    CreateTicketUseCase,
    FindAllTicketsUseCase,
    FindTicketByIdUseCase,
    FindTicketByNumberUseCase,
    UpdateTicketUseCase,
    RemoveTicketUseCase,
  ],
  exports: [
    FindTicketByIdUseCase,
    FindTicketByNumberUseCase,
    UpdateTicketUseCase,
    TypeOrmModule,
  ],
})
export class TicketModule {}
