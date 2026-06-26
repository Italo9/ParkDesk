import { Inject, Injectable } from '@nestjs/common';
import {
  Company,
  CompanyCnpjAlreadyExists,
  CompanyEmailAlreadyExists,
  CompanyTypeRequired,
  OperationNotAllowed,
} from '../domain/company';
import { COMPANY_REPOSITORY, CompanyRepository } from '../domain/ports/company.repository';
import { CreatedUser, USER_GATEWAY, UserGateway } from '../domain/ports/user-gateway';
import { CreateCompanyDto } from '../dto/create-company.dto';

@Injectable()
export class CreateCompanyUseCase {
  constructor(
    @Inject(COMPANY_REPOSITORY) private readonly companies: CompanyRepository,
    @Inject(USER_GATEWAY) private readonly users: UserGateway,
  ) {}

  async execute(dto: CreateCompanyDto, token: string) {
    const existing = await this.companies.findByEmail(dto.email as string);
    if (existing) throw new CompanyEmailAlreadyExists();

    const loggedUser = await this.users.findTypeByEmail(dto.user.loggedUserEmail as string);
    if (loggedUser?.type.toLowerCase() !== 'admin') {
      throw new OperationNotAllowed('Permitido o cadastro de empresa somente pelo perfil ADMIN');
    }

    let company: Company | undefined;
    let userCreate: CreatedUser | undefined;
    try {
      company = await this.companies.create({
        name: dto.name,
        cnpj: dto.cnpj,
        active: dto.active,
        peopleForContact: dto.peopleForContact,
        phone: dto.phone,
        email: dto.email,
      });
      if (company.id) {
        userCreate = await this.users.create(
          {
            name: dto.user.name,
            lastName: dto.user.lastName,
            email: dto.user.email,
            password: dto.user.password,
            companyId: company.id,
            type: dto.user.type,
          },
          token,
        );
        return { company, userCreate };
      }
    } catch (error: any) {
      if (company?.id) await this.companies.deleteById(company.id);
      if (userCreate?.id) await this.users.remove(userCreate.id, token);
      if (error?.code === '23505') throw new CompanyCnpjAlreadyExists();
      if (error?.code === '23502' && error?.column === 'type') throw new CompanyTypeRequired();
      throw error;
    }
  }
}
