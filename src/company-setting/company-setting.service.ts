import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanySetting } from './entities/company-setting.entity';
import { CreateCompanySettingDto } from './dto/create-company-setting.dto';
import { UpdateCompanySettingDto } from './dto/update-company-setting.dto';
import { UserService } from '../user/user.service';
import { CompanyService } from '../company/company.service';

@Injectable()
export class CompanySettingService {
  constructor(
    @InjectRepository(CompanySetting) private companySettingRepository: Repository<CompanySetting>,
    @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
    private readonly companyService: CompanyService,
  ) {}

  async create(createCompanySettingDto: CreateCompanySettingDto, token: string) {
    const existingSetting = await this.findOneByCompanyId(createCompanySettingDto.companyId);
    if (existingSetting) throw new BadRequestException('Já existe uma configuração para esta empresa.');
    await this.checkPermission(createCompanySettingDto.companyId, token);
    const companySetting = this.companySettingRepository.create({
      ValueHour: createCompanySettingDto.ValueHour,
      ValueFractionHour: createCompanySettingDto.ValueFractionHour,
      autorecharge: createCompanySettingDto.autorecharge,
      timeTolerance: `${createCompanySettingDto.timeTolerance}:00`,
      pixExpirationTime: createCompanySettingDto.pixExpirationTime,
      gateway: createCompanySettingDto.gateway,
      company: { id: createCompanySettingDto.companyId },
    });
    return this.companySettingRepository.save(companySetting);
  }

  async findOneByCompanyId(companyId: number) {
    return this.companySettingRepository.findOne({ where: { company: { id: companyId } }, relations: ['company'] });
  }

  async getCompanySettings(companyId: number, token: string) {
    await this.checkPermission(companyId, token);
    return this.findOneByCompanyId(companyId);
  }

  async update(companyId: number, updateCompanySettingDto: UpdateCompanySettingDto, token: string) {
    const existingSetting = await this.findOneByCompanyId(companyId);
    if (!existingSetting) throw new NotFoundException('Configuração da empresa não encontrada.');
    const userByToken = await this.userService.getUserByToken(token);
    const company = await this.companyService.findOne(String(companyId));
    if (!company) throw new NotFoundException('Empresa não encontrada');
    if (userByToken.type.toLowerCase() === 'admin' || userByToken.companies.some((c) => c.id === companyId)) {
      return this.companySettingRepository.save({
        ...existingSetting,
        ...updateCompanySettingDto,
        timeTolerance: updateCompanySettingDto.timeTolerance ? `${updateCompanySettingDto.timeTolerance}:00` : existingSetting.timeTolerance,
      });
    }
    throw new BadRequestException('Você não tem permissão para atualizar esta empresa');
  }

  async remove(companyId: number, token: string) {
    const existingSetting = await this.findOneByCompanyId(companyId);
    if (!existingSetting) throw new NotFoundException('Configuração da empresa não encontrada.');
    const userByToken = await this.userService.getUserByToken(token);
    const company = await this.companyService.findOne(String(companyId));
    if (!company) throw new NotFoundException('Empresa não encontrada');
    if (userByToken.type.toLowerCase() === 'admin' || userByToken.companies.some((c) => c.id === companyId)) {
      this.companySettingRepository.delete(existingSetting.id);
      return { message: 'Configuração da empresa removida com sucesso' };
    }
    throw new BadRequestException('Você não tem permissão para atualizar esta empresa');
  }

  async isAutoRechargeActive(companyId: number): Promise<boolean> {
    const s = await this.companySettingRepository.findOne({ where: { company: { id: companyId } } });
    return s ? s.autorecharge : false;
  }

  async checkPermission(companyId: number, token: string): Promise<void> {
    const userByToken = await this.userService.getUserByToken(token);
    if (userByToken.type.toLowerCase() !== 'admin' && userByToken.companies.some((c) => c.id === companyId)) {
      throw new BadRequestException('operação não permitida');
    }
  }
}
