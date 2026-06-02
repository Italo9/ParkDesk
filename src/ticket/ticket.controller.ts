import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AuthRequest } from '../auth/guards/auth.guard';
import { ApiKeyGuard } from '../api_key/guards/api-key.guard';
import { checkPermission } from '@/utils/check-permission';
import { User } from '@/user/entities/user.entity';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  @UseGuards(ApiKeyGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTicketDto: CreateTicketDto, @Req() req: AuthRequest): Promise<any> {
    checkPermission(req.user as User, 'create', req.companies);
    const apiKey = req.headers['authorization'] as string;
    if (!apiKey) throw new ForbiddenException('API Key não fornecida');
    return this.ticketService.create(createTicketDto);
  }

  @Get()
  @UseGuards(ApiKeyGuard)
  async findAll(@Req() req: AuthRequest) {
    const apiKey = req.headers['authorization'] as string;
    if (!apiKey) throw new ForbiddenException('API Key não fornecida');
    return this.ticketService.findAll(apiKey);
  }

  @Get(':id')
  @UseGuards(ApiKeyGuard)
  async findOne(@Param('id') id: number, @Req() req: AuthRequest) {
    const apiKey = req.headers['authorization'] as string;
    if (!apiKey) throw new ForbiddenException('API Key não fornecida');
    return this.ticketService.findOne(id, apiKey);
  }

  @Patch(':id')
  @UseGuards(ApiKeyGuard)
  async update(@Param('id') id: number, @Body() updateTicketDto: UpdateTicketDto, @Req() req: AuthRequest) {
    checkPermission(req.user as User, 'update', req.companies);
    const apiKey = req.headers['authorization'] as string;
    if (!apiKey) throw new ForbiddenException('API Key não fornecida');
    return this.ticketService.update(id, updateTicketDto);
  }

  @Delete(':id')
  @UseGuards(ApiKeyGuard)
  async remove(@Param('id') id: number, @Req() req: AuthRequest) {
    checkPermission(req.user as User, 'remove', req.companies);
    const apiKey = req.headers['authorization'] as string;
    if (!apiKey) throw new ForbiddenException('API Key não fornecida');
    return this.ticketService.remove(id, apiKey);
  }
}
