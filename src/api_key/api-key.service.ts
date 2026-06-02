import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ApiKey } from './entities/api-key.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EncryptionService } from './encryption.service';
import { CreateApiKeyRequestDto } from './dto/create-api-key-request.dto';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { Company } from '../company/entities/company.entity';
import { CompanyService } from '@/company/company.service';

@Injectable()
export class ApiKeyService {
  constructor(
    @InjectRepository(ApiKey)
    private readonly apiKeyRepository: Repository<ApiKey>,
    private userService: UserService,
    private readonly encryptionService: EncryptionService,
    private readonly companyService: CompanyService,
  ) {}

  async createApiKey(createApiKeyRequestDto: CreateApiKeyRequestDto, user: User, companies: Company[], token: string) {
    const company = companies[0];
    const existingCompany = await this.companyService.findOne(String(company.id));
    if (!existingCompany) throw new NotFoundException('Empresa não encontrada.');

    const { expirationDate, name, description, isActive } = createApiKeyRequestDto;
    const finalExpirationDate = expirationDate ? new Date(expirationDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    if (isNaN(finalExpirationDate.getTime())) throw new BadRequestException('Data de expiração inválida');

    const encryptedApiKey = this.encryptionService.generateApiKey(finalExpirationDate);
    const apiKeyEntity = new ApiKey();
    apiKeyEntity.apiKey = encryptedApiKey.encryptedApiKey as unknown as string;
    apiKeyEntity.expirationDate = finalExpirationDate;
    apiKeyEntity.user = user;
    apiKeyEntity.isActive = isActive;
    apiKeyEntity.company = existingCompany;
    apiKeyEntity.name = name;
    apiKeyEntity.description = description;
    await this.apiKeyRepository.save(apiKeyEntity);
    return { encryptedApiKey: apiKeyEntity.apiKey, expirationDate: finalExpirationDate };
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    const key = await this.apiKeyRepository.findOne({ where: { apiKey } });
    return !!key;
  }

  async findApiKey(apiKey: string): Promise<ApiKey | null> {
    const cleanedApiKey = apiKey.replace('Bearer ', '');
    const apiKeyEntity = await this.apiKeyRepository.findOne({ where: { apiKey: cleanedApiKey, isActive: true }, relations: ['company', 'user'] });
    if (!apiKeyEntity) { console.log('Nenhuma chave de API ativa encontrada'); return null; }
    if (apiKeyEntity.isExpired()) { console.log('A chave de API expirou'); return null; }
    return apiKeyEntity;
  }

  async findApiKeyById(id: string): Promise<ApiKey | null> {
    return this.apiKeyRepository.findOne({ where: { id: Number(id) } });
  }

  async findApiKeyByUserId(id: string): Promise<ApiKey | null> {
    return this.apiKeyRepository.findOne({ where: { user: { id } } });
  }

  async updateApiKey(apiKey: string, createApiKeyRequestDto: CreateApiKeyRequestDto): Promise<ApiKey> {
    const existingKey = await this.apiKeyRepository.findOne({ where: { apiKey } });
    if (!existingKey) throw new Error('API Key não encontrada');
    if (createApiKeyRequestDto.expirationDate) {
      existingKey.expirationDate = new Date(createApiKeyRequestDto.expirationDate);
    }
    return this.apiKeyRepository.save(existingKey);
  }

  async disableApiKeyById(id: string): Promise<void> {
    const key = await this.apiKeyRepository.findOne({ where: { id: Number(id) } });
    if (!key) throw new NotFoundException('API Key não encontrada.');
    key.isActive = false;
    await this.apiKeyRepository.save(key);
  }

  async findAllByCompany(token: string) {
    const loggedUser = await this.userService.getUserByToken(token);
    const companyId = loggedUser.companies;
    const apiKeys = await this.apiKeyRepository.createQueryBuilder('api_key').leftJoin('api_key.company', 'company').where('company.id = :companyId', { companyId }).andWhere('api_key.isActive = :isActive', { isActive: true }).getMany();
    apiKeys.forEach((apiKey) => { apiKey.apiKey = apiKey.apiKey.slice(0, 5) + '********' + apiKey.apiKey.slice(-5); });
    return apiKeys;
  }
}
