import { Injectable } from '@nestjs/common';
import { CompanyGateway } from '../../domain/ports/company-gateway';
import { GetCompanyByIdUseCase } from '../../../company/application/get-company-by-id.usecase';

@Injectable()
export class CompanyGatewayAdapter implements CompanyGateway {
  constructor(private readonly getCompanyById: GetCompanyByIdUseCase) {}

  async exists(companyId: number): Promise<boolean> {
    const company = await this.getCompanyById.execute(companyId);
    return !!company;
  }
}
