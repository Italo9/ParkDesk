import { Inject, Injectable } from '@nestjs/common';
import { CompanyNotFound, OperationNotAllowed } from '../domain/company';
import { COMPANY_REPOSITORY, CompanyRepository } from '../domain/ports/company.repository';
import { USER_GATEWAY, UserGateway } from '../domain/ports/user-gateway';

@Injectable()
export class RemoveCompanyUseCase {
  constructor(
    @Inject(COMPANY_REPOSITORY) private readonly companies: CompanyRepository,
    @Inject(USER_GATEWAY) private readonly users: UserGateway,
  ) {}

  async execute(id: string, token: string): Promise<{ message: string }> {
    const userByToken = await this.users.getByToken(token);
    const company = await this.companies.findByIdWithUsers(Number(id));
    if (!company) throw new CompanyNotFound();

    if (
      userByToken.type.toLowerCase() !== 'admin' &&
      !userByToken.companies.some((c) => c.id === company.id)
    ) {
      throw new OperationNotAllowed('Voce nao tem permissao para deletar esta empresa');
    }

    for (const member of company.users) {
      try {
        await this.users.deleteIdentity(member.email);
      } catch (error) {
        console.error(`Erro ao remover ${member.email} do Stack Auth:`, error);
      }
    }

    await this.users.removeUsersByCompany(company.id as number);
    await this.companies.deleteById(company.id as number);
    return { message: 'Empresa e usuarios deletados com sucesso' };
  }
}
