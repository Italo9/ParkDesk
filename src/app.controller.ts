import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth/guards/auth.guard';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
@Controller('protected')
export class ProtectedController {
  @UseGuards(AuthGuard)
  @Get()
  getProtectedData() {
    return { message: 'Você acessou um recurso protegido!' };
  }
}
