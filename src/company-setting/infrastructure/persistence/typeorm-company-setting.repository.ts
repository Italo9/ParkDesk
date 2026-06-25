import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanySetting } from '../../domain/company-setting';
import {
  CompanySettingRepository,
  CreateSettingData,
  SettingPatch,
} from '../../domain/ports/company-setting.repository';
import { CompanySetting as CompanySettingOrm } from '../../entities/company-setting.entity';
import { CompanySettingMapper } from './company-setting.mapper';

@Injectable()
export class TypeOrmCompanySettingRepository implements CompanySettingRepository {
  constructor(
    @InjectRepository(CompanySettingOrm)
    private readonly repo: Repository<CompanySettingOrm>,
  ) {}

  async create(data: CreateSettingData): Promise<CompanySetting> {
    const entity = this.repo.create({
      ValueHour: data.valueHour,
      ValueFractionHour: data.valueFractionHour,
      autorecharge: data.autorecharge,
      timeTolerance: data.timeTolerance,
      pixExpirationTime: data.pixExpirationTime,
      gateway: data.gateway,
      company: { id: data.companyId },
    });
    const saved = await this.repo.save(entity);
    return CompanySettingMapper.toDomain(saved);
  }

  async findByCompanyId(companyId: number): Promise<CompanySetting | null> {
    const row = await this.repo.findOne({
      where: { company: { id: companyId } },
      relations: ['company'],
    });
    return row ? CompanySettingMapper.toDomain(row) : null;
  }

  async update(id: number, patch: SettingPatch): Promise<CompanySetting | null> {
    const fields: Partial<CompanySettingOrm> = {};
    if (patch.valueHour !== undefined) fields.ValueHour = patch.valueHour;
    if (patch.valueFractionHour !== undefined) fields.ValueFractionHour = patch.valueFractionHour;
    if (patch.autorecharge !== undefined) fields.autorecharge = patch.autorecharge;
    if (patch.timeTolerance !== undefined) fields.timeTolerance = patch.timeTolerance;
    if (patch.pixExpirationTime !== undefined) fields.pixExpirationTime = patch.pixExpirationTime;
    if (patch.gateway !== undefined) fields.gateway = patch.gateway;

    if (Object.keys(fields).length > 0) {
      await this.repo.update(id, fields);
    }

    const row = await this.repo.findOne({ where: { id }, relations: ['company'] });
    return row ? CompanySettingMapper.toDomain(row) : null;
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
