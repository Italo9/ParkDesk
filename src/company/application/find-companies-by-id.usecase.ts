import { Inject, Injectable } from '@nestjs/common';
import { Company } from '../domain/company';
import { COMPANY_REPOSITORY, CompanyRepository } from '../domain/ports/company.repository';

@Injectable()
export class FindCompaniesByIdUseCase {
  constructor(@Inject(COMPANY_REPOSITORY) private readonly companies: CompanyRepository) {}

  execute(id: number): Promise<Company[]> {
    return this.companies.findAllByIdWithUsers(id);
  }
}
