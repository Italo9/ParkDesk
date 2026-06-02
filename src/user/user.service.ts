import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Company } from '../company/entities/company.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserStackDto } from '../auth/dto/users.use-case';
import { MailerService } from '@nestjs-modules/mailer';
import { StackAuthAdapter } from '../auth/adapters/stack-auth.adapter';
import { UserStackAuth } from '@/auth/entities/user.entity';
import { UserCompany } from '../shared/entities/user-company.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly mailerService: MailerService,
    @InjectRepository(Company) private companyRepository: Repository<Company>,
    @InjectRepository(UserCompany) private userCompanyRepository: Repository<UserCompany>,
    private stackAuthAdapter: StackAuthAdapter,
  ) {}

  private mapToCreateUserStackDto(dto: CreateUserDto): CreateUserStackDto {
    return {
      display_name: `${dto.name} ${dto.lastName}`,
      primary_email: dto.email,
      password: dto.password,
      primary_email_verified: true,
      primary_email_auth_enabled: true,
      client_metadata: { type: dto.type, companyId: dto.companyId },
    };
  }

  async createUser(userDto: CreateUserStackDto): Promise<UserStackAuth> {
    return await this.stackAuthAdapter.createUser(userDto);
  }

  async deleteUser(id: string): Promise<void> {
    return this.stackAuthAdapter.deleteUser(id);
  }

  async sendWelcomeEmail(userEmail: string, password: string, platformLink: string) {
    await this.mailerService.sendMail({
      to: userEmail,
      subject: 'Seja bem vindo!',
      template: 'welcome',
      context: { user: userEmail, password, platformLink },
    });
  }

  async create(createUserDto: CreateUserDto, token: string) {
    const userByToken = await this.getUserByToken(token);

    const company = await this.companyRepository.findOne({ where: { id: createUserDto.companyId } });
    if (!company) throw new NotFoundException('Empresa não encontrada');

    if (
      userByToken.type.toLowerCase() !== 'admin' &&
      !userByToken.companies.some((uc) => uc.id === createUserDto.companyId)
    ) {
      throw new BadRequestException('Você não tem permissão para criar usuários nesta empresa');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user: User = this.userRepository.create({ ...createUserDto, password: hashedPassword });
    const savedUser = await this.userRepository.save(user);

    const userCompany: UserCompany = this.userCompanyRepository.create({ company, user: savedUser });
    await this.userCompanyRepository.save(userCompany);

    await this.createUser(this.mapToCreateUserStackDto(createUserDto));
    return savedUser;
  }

  async findAll(token: string) {
    const userByToken = await this.getUserByToken(token);
    return this.userRepository.find({
      where: { companies: { id: userByToken.companies[0]?.id } },
      relations: ['companies'],
    });
  }

  async findOne(id: string, token: string) {
    const user = await this.userRepository.findOne({ where: { id }, relations: ['companies'] });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    const userByToken = await this.getUserByToken(token);
    if (
      userByToken.type.toLowerCase() === 'manager' &&
      userByToken.companies.some((company, i) => company.id === user.companies[i].id)
    ) {
      throw new ForbiddenException('Você não tem permissão para acessar este usuário');
    }
    return user;
  }

  async findOneCheckout(id: string) {
    const user = await this.userRepository.findOne({ where: { id }, relations: ['companies'] });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email }, relations: ['companies'] });
  }

  async update(id: string, updateUserDto: UpdateUserDto, token: string) {
    const userByToken = await this.getUserByToken(token);
    const user = await this.userRepository.findOne({ where: { id }, relations: ['companies'] });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    if (
      userByToken.type.toLowerCase() === 'manager' &&
      !user.companies.some((company) => userByToken.companies.map((c) => c.id).includes(company.id))
    ) {
      throw new ForbiddenException('Você não tem permissão para editar este usuário');
    }

    await this.userRepository.update(id, updateUserDto);
    return this.userRepository.findOne({ where: { id } });
  }

  async remove(id: string, token: string) {
    const userByToken = await this.getUserByToken(token);
    const user = await this.userRepository.findOne({ where: { id }, relations: ['companies'] });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    if (userByToken.type.toLowerCase() === 'manager') {
      const hasCommon = user.companies.some((id) => userByToken.companies.map((c) => c.id).includes(id.id));
      if (!hasCommon) throw new ForbiddenException('Você não tem permissão para deletar este usuário');
    }

    await this.userRepository.remove(user);
    return { message: 'Usuário removido com sucesso' };
  }

  async getUserByToken(token: string) {
    if (!token || !token.startsWith('Bearer ')) throw new UnauthorizedException('Token inválido');
    token = token.replace('Bearer ', '');
    const userData = await this.stackAuthAdapter.getUserByToken(token);
    const loggedUser = await this.userRepository.findOne({ where: { email: userData.primary_email }, relations: ['companies'] });
    if (!loggedUser) throw new UnauthorizedException('Usuário logado não encontrado');
    return loggedUser;
  }

  async removeByCompanyId(company: Company) {
    await this.userCompanyRepository.createQueryBuilder().delete().where('companyId = :companyId', { companyId: company.id }).execute();
    const usersWithoutCompanies = await this.userRepository.createQueryBuilder('user').leftJoin('user_companies', 'uc', 'user.id = uc.userId').where('uc.userId IS NULL').getMany();
    if (usersWithoutCompanies.length > 0) await this.userRepository.remove(usersWithoutCompanies);
  }
}
