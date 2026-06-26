import { Inject, Injectable } from '@nestjs/common';
import { Company } from '../domain/company';
import { COMPANY_REPOSITORY, CompanyRepository } from '../domain/ports/company.repository';

@Injectable()
export class GetCompanyByIdUseCase {
  constructor(@Inject(COMPANY_REPOSITORY) private readonly companies: CompanyRepository) {}

  execute(id: number): Promise<Company | null> {
    return this.companies.findById(id);
  }
}
