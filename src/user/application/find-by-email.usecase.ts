import { Inject, Injectable } from '@nestjs/common';
import { User } from '../domain/user';
import { USER_REPOSITORY, UserRepository } from '../domain/ports/user.repository';

@Injectable()
export class FindByEmailUseCase {
  constructor(@Inject(USER_REPOSITORY) private readonly users: UserRepository) {}

  execute(email: string): Promise<User | null> {
    return this.users.findByEmail(email);
  }
}
