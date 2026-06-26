import { Inject, Injectable } from '@nestjs/common';
import { CompanyCnpjAlreadyExists, CompanyCreateError, OperationNotAllowed } from '../domain/company';
import { COMPANY_REPOSITORY, CompanyRepository } from '../domain/ports/company.repository';
import { CreateCompanyByManagerDto } from '../dto/create-company-by-manager.dto';

interface RequesterUser {
  id: string;
  companies: { id: number }[];
}

@Injectable()
export class CreateCompanyByManagerUseCase {
  constructor(@Inject(COMPANY_REPOSITORY) private readonly companies: CompanyRepository) {}

  async execute(dto: CreateCompanyByManagerDto, token: string, user?: RequesterUser) {
    if (!user || !user.companies || user.companies.length === 0) {
      throw new OperationNotAllowed('Usuario nao possui empresa associada');
    }

    const existing = await this.companies.findByCnpj(dto.cnpj);
    if (existing) throw new CompanyCnpjAlreadyExists();

    const parent = await this.companies.findRootCompanyIdByUser(user.id);
    try {
      const company = await this.companies.create({
        name: dto.name,
        cnpj: dto.cnpj,
        active: dto.active,
        peopleForContact: dto.peopleForContact,
        phone: dto.phone,
        email: dto.email,
        matrizId: parent,
      });
      await this.companies.associateUser(user.id, company.id as number);
      return { company };
    } catch (error: any) {
      if (error?.code === '23505' && error?.detail?.includes?.('cnpj')) {
        throw new CompanyCnpjAlreadyExists();
      }
      throw new CompanyCreateError();
    }
  }
}
