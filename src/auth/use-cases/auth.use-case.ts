import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { AuthService } from '../ports/auth-service.interface';
import { UserService } from '../../user/user.service';
import { Company } from '@/company/entities/company.entity';

@Injectable()
export class AuthUseCase {
  constructor(
    @Inject('AuthService') private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async login(
    username: string,
    password: string,
  ): Promise<{ accessToken: string; companyId: Company[] | null }> {
    const user = await this.userService.findByEmail(username);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    const accessToken = await this.authService.authenticate(username, password);
    return { accessToken, companyId: user.companies || null };
  }

  async validateToken(token: string): Promise<boolean> {
    return this.authService.validateToken(token);
  }
}
