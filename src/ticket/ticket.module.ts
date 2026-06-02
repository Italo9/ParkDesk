import { forwardRef, Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { ApiKeyModule } from '../api_key/api-key.module';
import { UserService } from '@/user/user.service';
import { CompanyModule } from '@/company/company.module';
import { QrcodeModule } from '@/qrcode/qrcode.module';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket]), forwardRef(() => AuthModule), forwardRef(() => UserModule), forwardRef(() => ApiKeyModule), forwardRef(() => CompanyModule), forwardRef(() => QrcodeModule)],
  providers: [TicketService, UserService],
  exports: [TicketService],
  controllers: [TicketController],
})
export class TicketModule {}
