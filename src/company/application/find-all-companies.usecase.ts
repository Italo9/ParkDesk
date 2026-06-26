import { Inject, Injectable } from '@nestjs/common';
import { Company, OperationNotAllowed } from '../domain/company';
import { COMPANY_REPOSITORY, CompanyRepository } from '../domain/ports/company.repository';
import { USER_GATEWAY, UserGateway } from '../domain/ports/user-gateway';

@Injectable()
export class FindAllCompaniesUseCase {
  constructor(
    @Inject(COMPANY_REPOSITORY) private readonly companies: CompanyRepository,
    @Inject(USER_GATEWAY) private readonly users: UserGateway,
  ) {}

  async execute(token: string): Promise<Company[]> {
    const loggedUser = await this.users.getByToken(token);
    if (!loggedUser || loggedUser.type != 'admin') {
      throw new OperationNotAllowed('Voce nao tem permissao para acessar esta pagina');
    }
    return this.companies.findAll();
  }
}
