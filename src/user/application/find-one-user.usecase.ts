import { Inject, Injectable } from '@nestjs/common';
import { OperationNotAllowed, User, UserNotFound } from '../domain/user';
import { USER_REPOSITORY, UserRepository } from '../domain/ports/user.repository';
import { GetUserByTokenUseCase } from './get-user-by-token.usecase';

@Injectable()
export class FindOneUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    private readonly getUserByToken: GetUserByTokenUseCase,
  ) {}

  async execute(id: string, token: string): Promise<User> {
    const user = await this.users.findById(id);
    if (!user) throw new UserNotFound();

    const requester = await this.getUserByToken.execute(token);
    if (
      requester.type.toLowerCase() === 'manager' &&
      requester.companies.some((company, i) => company.id === user.companies[i].id)
    ) {
      throw new OperationNotAllowed('Voce nao tem permissao para acessar este usuario');
    }
    return user;
  }
}
