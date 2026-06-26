import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { OperationNotAllowed, User, UserCompanyNotFound } from '../domain/user';
import { USER_REPOSITORY, UserRepository } from '../domain/ports/user.repository';
import { COMPANY_GATEWAY, CompanyGateway } from '../domain/ports/company-gateway';
import { IDENTITY_GATEWAY, IdentityGateway } from '../domain/ports/identity-gateway';
import { CreateUserDto } from '../dto/create-user.dto';
import { GetUserByTokenUseCase } from './get-user-by-token.usecase';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(COMPANY_GATEWAY) private readonly companies: CompanyGateway,
    @Inject(IDENTITY_GATEWAY) private readonly identity: IdentityGateway,
    private readonly getUserByToken: GetUserByTokenUseCase,
  ) {}

  async execute(dto: CreateUserDto, token: string): Promise<User> {
    const requester = await this.getUserByToken.execute(token);

    const companyExists = await this.companies.exists(dto.companyId);
    if (!companyExists) throw new UserCompanyNotFound();

    if (
      requester.type.toLowerCase() !== 'admin' &&
      !requester.companies.some((uc) => uc.id === dto.companyId)
    ) {
      throw new OperationNotAllowed('Voce nao tem permissao para criar usuarios nesta empresa');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.users.create({
      name: dto.name,
      lastName: dto.lastName,
      email: dto.email,
      password: hashedPassword,
      type: dto.type,
      companyId: dto.companyId,
    });

    await this.identity.createUser({
      name: dto.name,
      lastName: dto.lastName,
      email: dto.email,
      password: dto.password,
      type: dto.type,
      companyId: dto.companyId,
    });

    return user;
  }
}
