import { Inject, Injectable } from '@nestjs/common';
import { OperationNotAllowed, UserNotFound } from '../domain/user';
import { USER_REPOSITORY, UserRepository } from '../domain/ports/user.repository';
import { GetUserByTokenUseCase } from './get-user-by-token.usecase';

@Injectable()
export class RemoveUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    private readonly getUserByToken: GetUserByTokenUseCase,
  ) {}

  async execute(id: string, token: string): Promise<{ message: string }> {
    const requester = await this.getUserByToken.execute(token);
    const user = await this.users.findById(id);
    if (!user) throw new UserNotFound();

    if (requester.type.toLowerCase() === 'manager') {
      const hasCommon = user.companies.some((uc) =>
        requester.companies.map((c) => c.id).includes(uc.id),
      );
      if (!hasCommon) {
        throw new OperationNotAllowed('Voce nao tem permissao para deletar este usuario');
      }
    }

    await this.users.remove(id);
    return { message: 'Usuario removido com sucesso' };
  }
}
