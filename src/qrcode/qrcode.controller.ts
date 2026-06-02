import { Controller, Get, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { QrcodeService } from './qrcode.service';
import { UpdateQrcodeDto } from './dto/update-qrcode.dto';
import { AuthGuard, AuthRequest } from '../auth/guards/auth.guard';
import { checkPermission } from '@/utils/check-permission';
import { User } from '@/user/entities/user.entity';

@Controller('qrcode')
export class QrcodeController {
  constructor(private readonly qrcodeService: QrcodeService) {}

  @Get()
  @UseGuards(AuthGuard)
  findAll() { return this.qrcodeService.findAll(); }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: number) { return this.qrcodeService.findOne(id); }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: number, @Body() updateQrcodeDto: UpdateQrcodeDto, @Req() req: AuthRequest) {
    const user: User = req.user as User;
    checkPermission(user, 'update', req.companies);
    return this.qrcodeService.update(id, updateQrcodeDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: number, @Req() req: AuthRequest) {
    const user: User = req.user as User;
    checkPermission(user, 'remove', req.companies);
    return this.qrcodeService.remove(id);
  }
}
