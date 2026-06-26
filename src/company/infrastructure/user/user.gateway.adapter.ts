import { Injectable } from '@nestjs/common';
import {
  CreatedUser,
  CreateUserInput,
  RequesterInfo,
  UserGateway,
} from '../../domain/ports/user-gateway';
import { FindByEmailUseCase } from '../../../user/application/find-by-email.usecase';
import { CreateUserUseCase } from '../../../user/application/create-user.usecase';
import { RemoveUserUseCase } from '../../../user/application/remove-user.usecase';
import { GetUserByTokenUseCase } from '../../../user/application/get-user-by-token.usecase';
import { DeleteIdentityUserUseCase } from '../../../user/application/delete-identity-user.usecase';
import { RemoveUsersByCompanyUseCase } from '../../../user/application/remove-users-by-company.usecase';

@Injectable()
export class UserGatewayAdapter implements UserGateway {
  constructor(
    private readonly findByEmailUseCase: FindByEmailUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly removeUserUseCase: RemoveUserUseCase,
    private readonly getUserByTokenUseCase: GetUserByTokenUseCase,
    private readonly deleteIdentityUseCase: DeleteIdentityUserUseCase,
    private readonly removeByCompanyUseCase: RemoveUsersByCompanyUseCase,
  ) {}

  async findTypeByEmail(email: string): Promise<{ type: string } | null> {
    const user = await this.findByEmailUseCase.execute(email);
    return user ? { type: user.type } : null;
  }

  async create(input: CreateUserInput, token: string): Promise<CreatedUser> {
    const user = await this.createUserUseCase.execute(
      {
        name: input.name,
        lastName: input.lastName,
        email: input.email,
        password: input.password,
        companyId: input.companyId,
        type: input.type,
      },
      token,
    );
    return { id: user.id };
  }

  async remove(id: string, token: string): Promise<void> {
    await this.removeUserUseCase.execute(id, token);
  }

  async getByToken(token: string): Promise<RequesterInfo> {
    const user = await this.getUserByTokenUseCase.execute(token);
    return { type: user.type, companies: user.companies.map((c) => ({ id: c.id })) };
  }

  async deleteIdentity(emailOrId: string): Promise<void> {
    await this.deleteIdentityUseCase.execute(emailOrId);
  }

  async removeUsersByCompany(companyId: number): Promise<void> {
    await this.removeByCompanyUseCase.execute(companyId);
  }
}
