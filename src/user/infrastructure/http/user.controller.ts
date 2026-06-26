import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthGuard, AuthRequest } from '@/auth/guards/auth.guard';
import { checkPermission } from '@/utils/check-permission';
import { User } from '@/user/entities/user.entity';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { CreateUserUseCase } from '../../application/create-user.usecase';
import { FindAllUsersUseCase } from '../../application/find-all-users.usecase';
import { GetUserByTokenUseCase } from '../../application/get-user-by-token.usecase';
import { FindOneUserUseCase } from '../../application/find-one-user.usecase';
import { UpdateUserUseCase } from '../../application/update-user.usecase';
import { RemoveUserUseCase } from '../../application/remove-user.usecase';

@Controller('user')
export class UserController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly findAllUsers: FindAllUsersUseCase,
    private readonly getUserByToken: GetUserByTokenUseCase,
    private readonly findOneUser: FindOneUserUseCase,
    private readonly updateUser: UpdateUserUseCase,
    private readonly removeUser: RemoveUserUseCase,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() dto: CreateUserDto, @Req() request: AuthRequest) {
    const user = request.user as User;
    checkPermission(user, 'createUser', request.companies);
    return this.createUser.execute(dto, request.headers.authorization as string);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Req() request: AuthRequest) {
    return this.findAllUsers.execute(request.headers.authorization as string);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  me(@Req() request: AuthRequest) {
    return this.getUserByToken.execute(request.headers.authorization as string);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string, @Req() request: AuthRequest) {
    return this.findOneUser.execute(id, request.headers.authorization as string);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() dto: UpdateUserDto, @Req() request: AuthRequest) {
    const user = request.user as User;
    checkPermission(user, 'update', request.companies);
    return this.updateUser.execute(id, dto, request.headers.authorization as string);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @Req() request: AuthRequest) {
    const user = request.user as User;
    checkPermission(user, 'remove', request.companies);
    return this.removeUser.execute(id, request.headers.authorization as string);
  }
}
