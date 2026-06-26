import { Injectable } from '@nestjs/common';
import { CompanyGateway } from '../../domain/ports/company-gateway';
import { CompanyService } from '../../../company/company.service';

@Injectable()
export class CompanyGatewayAdapter implements CompanyGateway {
  constructor(private readonly companyService: CompanyService) {}

  async exists(companyId: number): Promise<boolean> {
    try {
      const company = await this.companyService.findOne(String(companyId));
      return !!company;
    } catch {
      return false;
    }
  }
}
