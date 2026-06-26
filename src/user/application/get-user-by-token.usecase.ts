import { Inject, Injectable } from '@nestjs/common';
import { InvalidToken, User } from '../domain/user';
import { USER_REPOSITORY, UserRepository } from '../domain/ports/user.repository';
import { IDENTITY_GATEWAY, IdentityGateway } from '../domain/ports/identity-gateway';

@Injectable()
export class GetUserByTokenUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(IDENTITY_GATEWAY) private readonly identity: IdentityGateway,
  ) {}

  async execute(token: string): Promise<User> {
    if (!token || !token.startsWith('Bearer ')) throw new InvalidToken();
    const raw = token.replace('Bearer ', '');
    const email = await this.identity.getEmailByToken(raw);
    const user = await this.users.findByEmail(email);
    if (!user) throw new InvalidToken();
    return user;
  }
}
