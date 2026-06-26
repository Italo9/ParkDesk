import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyGateway } from '../../domain/ports/company-gateway';
import { Company } from '../../../company/entities/company.entity';

@Injectable()
export class CompanyGatewayAdapter implements CompanyGateway {
  constructor(
    @InjectRepository(Company) private readonly companyRepo: Repository<Company>,
  ) {}

  async exists(companyId: number): Promise<boolean> {
    const company = await this.companyRepo.findOne({ where: { id: companyId } });
    return !!company;
  }
}
