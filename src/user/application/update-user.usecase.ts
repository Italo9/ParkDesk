import { Inject, Injectable } from '@nestjs/common';
import { OperationNotAllowed, User, UserNotFound } from '../domain/user';
import { USER_REPOSITORY, UserRepository } from '../domain/ports/user.repository';
import { UpdateUserDto } from '../dto/update-user.dto';
import { GetUserByTokenUseCase } from './get-user-by-token.usecase';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    private readonly getUserByToken: GetUserByTokenUseCase,
  ) {}

  async execute(id: string, dto: UpdateUserDto, token: string): Promise<User | null> {
    const requester = await this.getUserByToken.execute(token);
    const user = await this.users.findById(id);
    if (!user) throw new UserNotFound();

    if (
      requester.type.toLowerCase() === 'manager' &&
      !user.companies.some((company) => requester.companies.map((c) => c.id).includes(company.id))
    ) {
      throw new OperationNotAllowed('Voce nao tem permissao para editar este usuario');
    }

    return this.users.update(id, {
      name: dto.name,
      lastName: dto.lastName,
      email: dto.email,
      password: dto.password,
      type: dto.type,
    });
  }
}
