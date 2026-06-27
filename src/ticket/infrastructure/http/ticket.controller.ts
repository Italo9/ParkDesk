import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { AuthRequest } from '@/auth/guards/auth.guard';
import { ApiKeyGuard } from '@/api_key/guards/api-key.guard';
import { checkPermission } from '@/utils/check-permission';
import { User } from '@/user/entities/user.entity';
import { CreateTicketDto } from '../../dto/create-ticket.dto';
import { UpdateTicketDto } from '../../dto/update-ticket.dto';
import { CreateTicketUseCase } from '../../application/create-ticket.usecase';
import { FindAllTicketsUseCase } from '../../application/find-all-tickets.usecase';
import { FindTicketByIdUseCase } from '../../application/find-ticket-by-id.usecase';
import { UpdateTicketUseCase } from '../../application/update-ticket.usecase';
import { RemoveTicketUseCase } from '../../application/remove-ticket.usecase';

@Controller('ticket')
export class TicketController {
  constructor(
    private readonly createTicket: CreateTicketUseCase,
    private readonly findAllTickets: FindAllTicketsUseCase,
    private readonly findTicketById: FindTicketByIdUseCase,
    private readonly updateTicket: UpdateTicketUseCase,
    private readonly removeTicket: RemoveTicketUseCase,
  ) {}

  @Post()
  @UseGuards(ApiKeyGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateTicketDto, @Req() req: AuthRequest): Promise<any> {
    checkPermission(req.user as User, 'create', req.companies);
    const apiKey = req.headers['authorization'] as string;
    if (!apiKey) throw new ForbiddenException('API Key nao fornecida');
    return this.createTicket.execute(dto, req.companyId);
  }

  @Get()
  @UseGuards(ApiKeyGuard)
  async findAll(@Req() req: AuthRequest) {
    const apiKey = req.headers['authorization'] as string;
    if (!apiKey) throw new ForbiddenException('API Key nao fornecida');
    return this.findAllTickets.execute(apiKey);
  }

  @Get(':id')
  @UseGuards(ApiKeyGuard)
  async findOne(@Param('id') id: number, @Req() req: AuthRequest) {
    const apiKey = req.headers['authorization'] as string;
    if (!apiKey) throw new ForbiddenException('API Key nao fornecida');
    return this.findTicketById.execute(id, apiKey);
  }

  @Patch(':id')
  @UseGuards(ApiKeyGuard)
  async update(@Param('id') id: number, @Body() dto: UpdateTicketDto, @Req() req: AuthRequest) {
    checkPermission(req.user as User, 'update', req.companies);
    const apiKey = req.headers['authorization'] as string;
    if (!apiKey) throw new ForbiddenException('API Key nao fornecida');
    return this.updateTicket.execute(id, dto);
  }

  @Delete(':id')
  @UseGuards(ApiKeyGuard)
  async remove(@Param('id') id: number, @Req() req: AuthRequest) {
    checkPermission(req.user as User, 'remove', req.companies);
    const apiKey = req.headers['authorization'] as string;
    if (!apiKey) throw new ForbiddenException('API Key nao fornecida');
    return this.removeTicket.execute(id, apiKey);
  }
}
