import { Inject, Injectable } from '@nestjs/common';
import { Company, CompanyNotFound, OperationNotAllowed } from '../domain/company';
import { COMPANY_REPOSITORY, CompanyRepository } from '../domain/ports/company.repository';
import { USER_GATEWAY, UserGateway } from '../domain/ports/user-gateway';
import { UpdateCompanyDto } from '../dto/update-company.dto';

@Injectable()
export class UpdateCompanyUseCase {
  constructor(
    @Inject(COMPANY_REPOSITORY) private readonly companies: CompanyRepository,
    @Inject(USER_GATEWAY) private readonly users: UserGateway,
  ) {}

  async execute(id: string, dto: UpdateCompanyDto, token: string): Promise<Company> {
    const userByToken = await this.users.getByToken(token);
    const company = await this.companies.findById(Number(id));
    if (!company) throw new CompanyNotFound();

    const allowed =
      userByToken.type.toLowerCase() === 'admin' ||
      userByToken.companies.some((c) => c.id === company.id);
    if (!allowed) {
      throw new OperationNotAllowed('Voce nao tem permissao para atualizar esta empresa');
    }

    await this.companies.update(Number(id), {
      name: dto.name,
      cnpj: dto.cnpj,
      active: dto.active,
      peopleForContact: dto.peopleForContact,
      phone: dto.phone,
      email: dto.email,
    });

    const updated = await this.companies.findByIdWithUsers(Number(id));
    if (!updated) throw new CompanyNotFound(id);
    return updated;
  }
}
