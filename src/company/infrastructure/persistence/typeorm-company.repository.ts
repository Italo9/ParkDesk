import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company, CompanyAssociationError } from '../../domain/company';
import {
  CompanyRepository,
  CreateCompanyData,
  UpdateCompanyData,
} from '../../domain/ports/company.repository';
import { Company as CompanyOrm } from '../../entities/company.entity';
import { UserCompany } from '../../../shared/entities/user-company.entity';
import { User } from '../../../user/entities/user.entity';
import { CompanyMapper } from './company.mapper';

@Injectable()
export class TypeOrmCompanyRepository implements CompanyRepository {
  constructor(
    @InjectRepository(CompanyOrm) private readonly repo: Repository<CompanyOrm>,
    @InjectRepository(UserCompany) private readonly userCompanyRepo: Repository<UserCompany>,
  ) {}

  async findByEmail(email: string): Promise<Company | null> {
    const row = await this.repo.findOne({ where: { email } });
    return row ? CompanyMapper.toDomain(row) : null;
  }

  async findByCnpj(cnpj: string): Promise<Company | null> {
    const row = await this.repo.findOne({ where: { cnpj } });
    return row ? CompanyMapper.toDomain(row) : null;
  }

  async findById(id: number): Promise<Company | null> {
    const row = await this.repo.findOne({ where: { id } });
    return row ? CompanyMapper.toDomain(row) : null;
  }

  async findByIdWithUsers(id: number): Promise<Company | null> {
    const row = await this.repo.findOne({ where: { id }, relations: ['users'] });
    return row ? CompanyMapper.toDomain(row) : null;
  }

  async findAll(): Promise<Company[]> {
    const rows = await this.repo.find();
    return rows.map(CompanyMapper.toDomain);
  }

  async findAllByIdWithUsers(id: number): Promise<Company[]> {
    const rows = await this.repo.find({ where: { id }, relations: ['users'] });
    return rows.map(CompanyMapper.toDomain);
  }

  async create(data: CreateCompanyData): Promise<Company> {
    const entity = this.repo.create({
      name: data.name,
      cnpj: data.cnpj,
      active: data.active,
      peopleForContact: data.peopleForContact,
      phone: data.phone,
      email: data.email,
      matrizId: data.matrizId,
    });
    const saved = await this.repo.save(entity);
    return CompanyMapper.toDomain(saved);
  }

  async update(id: number, patch: UpdateCompanyData): Promise<void> {
    const fields: Partial<CompanyOrm> = {};
    if (patch.name !== undefined) fields.name = patch.name;
    if (patch.cnpj !== undefined) fields.cnpj = patch.cnpj;
    if (patch.active !== undefined) fields.active = patch.active;
    if (patch.peopleForContact !== undefined) fields.peopleForContact = patch.peopleForContact;
    if (patch.phone !== undefined) fields.phone = patch.phone;
    if (patch.email !== undefined) fields.email = patch.email;
    if (Object.keys(fields).length > 0) await this.repo.update(id, fields);
  }

  async deleteById(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async findRootCompanyIdByUser(userId: string): Promise<number> {
    const parent = await this.repo
      .createQueryBuilder('company')
      .innerJoin('company.users', 'user', 'user.id = :userId', { userId })
      .where('company.matrizId IS NULL')
      .getOne();
    return parent?.id || 0;
  }

  async associateUser(userId: string, companyId: number): Promise<void> {
    try {
      const association = this.userCompanyRepo.create({
        user: { id: userId } as User,
        company: { id: companyId } as CompanyOrm,
      });
      await this.userCompanyRepo.save(association);
    } catch (error) {
      console.error('Erro ao associar usuario a empresa:', error);
      throw new CompanyAssociationError();
    }
  }
}
