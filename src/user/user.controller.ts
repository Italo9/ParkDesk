import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard, AuthRequest } from '../auth/guards/auth.guard';
import { checkPermission } from '@/utils/check-permission';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createUserDto: CreateUserDto, @Req() request: AuthRequest) {
    const user: User = request.user as User;
    checkPermission(user, 'createUser', request.companies);
    return this.userService.create(createUserDto, request.headers.authorization as string);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Req() request: AuthRequest) {
    return this.userService.findAll(request.headers.authorization as string);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  getUserByToken(@Req() req): Promise<any> {
    return this.userService.getUserByToken(req.headers.authorization);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string, @Req() request: AuthRequest) {
    return this.userService.findOne(id, request.headers.authorization as string);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Req() request: AuthRequest) {
    const user: User = request.user as User;
    checkPermission(user, 'update', request.companies);
    return this.userService.update(id, updateUserDto, request.headers.authorization as string);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @Req() request: AuthRequest) {
    const user: User = request.user as User;
    checkPermission(user, 'remove', request.companies);
    return this.userService.remove(id, request.headers.authorization as string);
  }
}
