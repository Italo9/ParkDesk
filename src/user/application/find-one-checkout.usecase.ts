import { Inject, Injectable } from '@nestjs/common';
import { User, UserNotFound } from '../domain/user';
import { USER_REPOSITORY, UserRepository } from '../domain/ports/user.repository';

@Injectable()
export class FindOneCheckoutUseCase {
  constructor(@Inject(USER_REPOSITORY) private readonly users: UserRepository) {}

  async execute(id: string): Promise<User> {
    const user = await this.users.findById(id);
    if (!user) throw new UserNotFound();
    return user;
  }
}
