import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY, UserRepository } from '../domain/ports/user.repository';

@Injectable()
export class RemoveUsersByCompanyUseCase {
  constructor(@Inject(USER_REPOSITORY) private readonly users: UserRepository) {}

  async execute(companyId: number): Promise<void> {
    await this.users.removeOrphansByCompany(companyId);
  }
}
