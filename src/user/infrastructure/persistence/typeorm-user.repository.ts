import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/user';
import {
  CreateUserData,
  UpdateUserData,
  UserRepository,
} from '../../domain/ports/user.repository';
import { User as UserOrm } from '../../entities/user.entity';
import { Company } from '../../../company/entities/company.entity';
import { UserCompany } from '../../../shared/entities/user-company.entity';
import { UserMapper } from './user.mapper';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserOrm) private readonly repo: Repository<UserOrm>,
    @InjectRepository(UserCompany) private readonly userCompanyRepo: Repository<UserCompany>,
  ) {}

  async create(data: CreateUserData): Promise<User> {
    const entity = this.repo.create({
      name: data.name,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      type: data.type,
    });
    const saved = await this.repo.save(entity);

    const association = this.userCompanyRepo.create({
      company: { id: data.companyId } as Company,
      user: saved,
    });
    await this.userCompanyRepo.save(association);

    saved.companies = [{ id: data.companyId } as Company];
    return UserMapper.toDomain(saved);
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await this.repo.findOne({ where: { email }, relations: ['companies'] });
    return row ? UserMapper.toDomain(row) : null;
  }

  async findById(id: string): Promise<User | null> {
    const row = await this.repo.findOne({ where: { id }, relations: ['companies'] });
    return row ? UserMapper.toDomain(row) : null;
  }

  async findAllByCompany(companyId: number | undefined): Promise<User[]> {
    const rows = await this.repo.find({
      where: { companies: { id: companyId } },
      relations: ['companies'],
    });
    return rows.map(UserMapper.toDomain);
  }

  async update(id: string, patch: UpdateUserData): Promise<User | null> {
    const fields: Partial<UserOrm> = {};
    if (patch.name !== undefined) fields.name = patch.name;
    if (patch.lastName !== undefined) fields.lastName = patch.lastName;
    if (patch.email !== undefined) fields.email = patch.email;
    if (patch.password !== undefined) fields.password = patch.password;
    if (patch.type !== undefined) fields.type = patch.type;

    if (Object.keys(fields).length > 0) {
      await this.repo.update(id, fields);
    }
    const row = await this.repo.findOne({ where: { id }, relations: ['companies'] });
    return row ? UserMapper.toDomain(row) : null;
  }

  async remove(id: string): Promise<void> {
    const row = await this.repo.findOne({ where: { id } });
    if (row) await this.repo.remove(row);
  }

  async removeOrphansByCompany(companyId: number): Promise<void> {
    await this.userCompanyRepo
      .createQueryBuilder()
      .delete()
      .where('companyId = :companyId', { companyId })
      .execute();

    const orphans = await this.repo
      .createQueryBuilder('user')
      .leftJoin('user_companies', 'uc', 'user.id = uc.userId')
      .where('uc.userId IS NULL')
      .getMany();

    if (orphans.length > 0) await this.repo.remove(orphans);
  }
}
