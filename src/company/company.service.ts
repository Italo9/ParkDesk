import { Injectable, BadRequestException, Inject, forwardRef, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UserService } from '../user/user.service';
import { CreateCompanyByManagerDto } from './dto/create-company-by-manager.dto';
import { User } from '../user/entities/user.entity';
import { UserCompany } from '../shared/entities/user-company.entity';

@Injectable()
export class CompanyService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Company) private companyRepository: Repository<Company>,
    @InjectRepository(UserCompany) private userCompanyRepository: Repository<UserCompany>,
    @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
  ) {}

  async create(createCompanyDto: CreateCompanyDto, token: string) {
    const { user, ...companyData } = createCompanyDto;
    const existingCompany = await this.companyRepository.findOne({ where: { email: companyData.email } });
    if (existingCompany) throw new BadRequestException('Já existe uma empresa cadastrada com este e-mail.');

    const loggedUser = await this.userService.findByEmail(createCompanyDto.user.loggedUserEmail as string);
    if (loggedUser?.type.toLocaleLowerCase() !== 'admin') throw new BadRequestException('Permitido o cadastro de empresa somente pelo perfil ADMIN');

    let response; let userCreate; let company;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      company = this.companyRepository.create(companyData);
      company = await this.companyRepository.save(company);
      if (company.id) {
        userCreate = await this.userService.create({ name: user.name, lastName: user.lastName, email: user.email, password: user.password, companyId: company.id, type: user.type }, token);
        await queryRunner.commitTransaction();
        return { company, userCreate };
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (company?.id) {
        const ce = await this.companyRepository.findOne({ where: { id: company.id } });
        if (ce) await this.companyRepository.remove(ce);
      }
      if (userCreate?.id) await this.userService.remove(userCreate.id, token);
      if (error.code === '23505') throw new BadRequestException('Já existe uma empresa cadastrada com este CNPJ.');
      if (error.code === '23502' && error.column === 'type') throw new BadRequestException('O campo "type" é obrigatório e não pode ser nulo.');
      throw error;
    }
  }

  private async getParentCompany(user: User): Promise<number> {
    if (!user || !user.companies || user.companies.length === 0) return 0;
    const parentCompany = await this.companyRepository.createQueryBuilder('company').innerJoin('company.users', 'user', 'user.id = :userId', { userId: user.id }).where('company.matrizId IS NULL').getOne();
    return parentCompany?.id || 0;
  }

  private async associateUserToCompany(user: User, company: Company) {
    try {
      const userCompany = this.userCompanyRepository.create({ user, company });
      return await this.userCompanyRepository.save(userCompany);
    } catch (error) {
      console.error('Erro ao associar usuário à empresa:', error);
      throw new InternalServerErrorException('Erro ao associar usuário à empresa');
    }
  }

  async createCompanyByManager(createCompanyDto: CreateCompanyByManagerDto, token: string, user?: User) {
    if (!user || !user.companies || user.companies.length === 0) throw new BadRequestException('Usuário não possui empresa associada');
    const existingCompany = await this.companyRepository.findOne({ where: { cnpj: createCompanyDto.cnpj } });
    if (existingCompany) throw new BadRequestException('Já existe uma empresa cadastrada com este CNPJ.');
    const parentCompany = await this.getParentCompany(user);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const company = this.companyRepository.create({ ...createCompanyDto, matrizId: parentCompany });
      const savedCompany = await queryRunner.manager.save(company);
      await queryRunner.commitTransaction();
      await this.associateUserToCompany(user, savedCompany);
      return { company: savedCompany };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof QueryFailedError && (error as any).code === '23505') {
        if ((error as any).detail.includes('cnpj')) throw new BadRequestException('Já existe uma empresa cadastrada com este CNPJ.');
      }
      throw new InternalServerErrorException('Erro ao criar empresa.');
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(token) {
    const loggedUser = await this.userService.getUserByToken(token);
    if (!loggedUser || loggedUser.type != 'admin') throw new BadRequestException('Você não tem permissão para acessar esta página');
    return this.companyRepository.find();
  }

  async findAllByCompany(id: number) {
    return this.companyRepository.find({ where: { id }, relations: ['users'] });
  }

  async findOne(id: string) {
    const company = await this.companyRepository.findOne({ where: { id: Number(id) }, relations: ['users'] });
    if (!company) throw new NotFoundException(`Empresa com ID ${id} não encontrada.`);
    return company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, token: string) {
    const userByToken = await this.userService.getUserByToken(token);
    const company = await this.companyRepository.findOne({ where: { id: Number(id) } });
    if (!company) throw new NotFoundException('Empresa não encontrada');
    if (userByToken.type.toLowerCase() === 'admin' || userByToken.companies.some((c) => c.id === company.id)) {
      await this.companyRepository.update(id, updateCompanyDto);
      return this.findOne(id);
    }
    throw new BadRequestException('Você não tem permissão para atualizar esta empresa');
  }

  async remove(id: string, token: string) {
    const userByToken = await this.userService.getUserByToken(token);
    const company = await this.companyRepository.findOne({ where: { id: Number(id) }, relations: ['users'] });
    if (!company) throw new NotFoundException('Empresa não encontrada');
    if (userByToken.type.toLowerCase() !== 'admin' && !userByToken.companies.some((c) => c.id === company.id)) {
      throw new BadRequestException('Você não tem permissão para deletar esta empresa');
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (const user of company.users) {
        try { await this.userService.deleteUser(user.email); } catch (e) { console.error(`Erro ao remover ${user.email} do Stack Auth:`, e); }
      }
      await this.userService.removeByCompanyId(company);
      await this.companyRepository.delete(company.id);
      await queryRunner.commitTransaction();
      return { message: 'Empresa e usuários deletados com sucesso' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Erro ao deletar empresa');
    } finally {
      await queryRunner.release();
    }
  }
}
