import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ApiKey } from '../../domain/api-key';
import { ApiKeyRepository, CreateApiKeyData } from '../../domain/ports/api-key.repository';
import { ApiKey as ApiKeyOrm } from '../../entities/api-key.entity';
import { ApiKeyMapper } from './api-key.mapper';

@Injectable()
export class TypeOrmApiKeyRepository implements ApiKeyRepository {
  constructor(
    @InjectRepository(ApiKeyOrm)
    private readonly repo: Repository<ApiKeyOrm>,
  ) {}

  async create(data: CreateApiKeyData): Promise<ApiKey> {
    const entity = this.repo.create({
      apiKey: data.apiKey,
      name: data.name,
      description: data.description,
      company: { id: data.companyId },
      user: { id: data.userId },
      expirationDate: data.expirationDate,
      isActive: data.isActive,
    });
    const saved = await this.repo.save(entity);
    return ApiKeyMapper.toDomain(saved);
  }

  async findActiveByValue(value: string): Promise<ApiKey | null> {
    const row = await this.repo.findOne({
      where: { apiKey: value, isActive: true },
      relations: ['company', 'user'],
    });
    return row ? ApiKeyMapper.toDomain(row) : null;
  }

  async findByValue(value: string): Promise<ApiKey | null> {
    const row = await this.repo.findOne({
      where: { apiKey: value },
      relations: ['company', 'user'],
    });
    return row ? ApiKeyMapper.toDomain(row) : null;
  }

  async existsByValue(value: string): Promise<boolean> {
    const row = await this.repo.findOne({ where: { apiKey: value } });
    return !!row;
  }

  async findById(id: number): Promise<ApiKey | null> {
    const row = await this.repo.findOne({
      where: { id },
      relations: ['company', 'user'],
    });
    return row ? ApiKeyMapper.toDomain(row) : null;
  }

  async findByUserId(userId: string): Promise<ApiKey | null> {
    const row = await this.repo.findOne({
      where: { user: { id: userId } },
      relations: ['company', 'user'],
    });
    return row ? ApiKeyMapper.toDomain(row) : null;
  }

  async updateExpiration(value: string, expirationDate: Date): Promise<ApiKey> {
    await this.repo.update({ apiKey: value }, { expirationDate });
    const row = await this.repo.findOne({
      where: { apiKey: value },
      relations: ['company', 'user'],
    });
    return ApiKeyMapper.toDomain(row as ApiKeyOrm);
  }

  async setActive(id: number, isActive: boolean): Promise<void> {
    await this.repo.update(id, { isActive });
  }

  async findActiveByCompany(companyIds: number[]): Promise<ApiKey[]> {
    const rows = await this.repo.find({
      where: { company: { id: In(companyIds) }, isActive: true },
      relations: ['company', 'user'],
    });
    return rows.map(ApiKeyMapper.toDomain);
  }
}
