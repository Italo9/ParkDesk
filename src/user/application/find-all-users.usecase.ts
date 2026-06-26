import { Injectable } from '@nestjs/common';
import { User } from '../domain/user';
import { USER_REPOSITORY, UserRepository } from '../domain/ports/user.repository';
import { Inject } from '@nestjs/common';
import { GetUserByTokenUseCase } from './get-user-by-token.usecase';

@Injectable()
export class FindAllUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    private readonly getUserByToken: GetUserByTokenUseCase,
  ) {}

  async execute(token: string): Promise<User[]> {
    const requester = await this.getUserByToken.execute(token);
    return this.users.findAllByCompany(requester.companies[0]?.id);
  }
}
