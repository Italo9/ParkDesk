import { Controller, Get, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthGuard, AuthRequest } from '@/auth/guards/auth.guard';
import { checkPermission } from '@/utils/check-permission';
import { User } from '@/user/entities/user.entity';
import { UpdateQrcodeDto } from '../../dto/update-qrcode.dto';
import { ListTicketsUseCase } from '../../application/list-tickets.usecase';
import { GetTicketUseCase } from '../../application/get-ticket.usecase';
import { UpdateTicketUseCase } from '../../application/update-ticket.usecase';
import { RemoveTicketUseCase } from '../../application/remove-ticket.usecase';

@Controller('qrcode')
export class QrcodeController {
  constructor(
    private readonly listTickets: ListTicketsUseCase,
    private readonly getTicket: GetTicketUseCase,
    private readonly updateTicket: UpdateTicketUseCase,
    private readonly removeTicket: RemoveTicketUseCase,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.listTickets.execute();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: number) {
    return this.getTicket.execute(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: number, @Body() dto: UpdateQrcodeDto, @Req() req: AuthRequest) {
    const user = req.user as User;
    checkPermission(user, 'update', req.companies);
    return this.updateTicket.execute(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: number, @Req() req: AuthRequest) {
    const user = req.user as User;
    checkPermission(user, 'remove', req.companies);
    return this.removeTicket.execute(id);
  }
}
