import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Ticket } from '../ticket/entities/ticket.entity';
import { Qrcode } from './entities/qrcode.entity';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { QrcodeController } from './infrastructure/http/qrcode.controller';
import { TypeOrmQrcodeRepository } from './infrastructure/persistence/typeorm-qrcode.repository';
import { TicketStoreAdapter } from './infrastructure/persistence/ticket-store.adapter';
import { QrImageAdapter } from './infrastructure/qr-image/qr-image.adapter';
import { QRCODE_REPOSITORY } from './domain/ports/qrcode.repository';
import { TICKET_STORE } from './domain/ports/ticket-store';
import { QR_IMAGE } from './domain/ports/qr-image';
import { GenerateQrCodeUseCase } from './application/generate-qr-code.usecase';
import { ValidateQrCodeUseCase } from './application/validate-qr-code.usecase';
import { ListTicketsUseCase } from './application/list-tickets.usecase';
import { GetTicketUseCase } from './application/get-ticket.usecase';
import { UpdateTicketUseCase } from './application/update-ticket.usecase';
import { RemoveTicketUseCase } from './application/remove-ticket.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([Qrcode, Ticket]),
    ConfigModule,
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
  ],
  controllers: [QrcodeController],
  providers: [
    { provide: QRCODE_REPOSITORY, useClass: TypeOrmQrcodeRepository },
    { provide: TICKET_STORE, useClass: TicketStoreAdapter },
    { provide: QR_IMAGE, useClass: QrImageAdapter },
    GenerateQrCodeUseCase,
    ValidateQrCodeUseCase,
    ListTicketsUseCase,
    GetTicketUseCase,
    UpdateTicketUseCase,
    RemoveTicketUseCase,
  ],
  exports: [GenerateQrCodeUseCase, ValidateQrCodeUseCase],
})
export class QrcodeModule {}
