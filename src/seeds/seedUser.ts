import { AppDataSource } from '../../src/data-source';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../src/app.module';
import { CreateUserStackDto } from '../auth/dto/users.use-case';
import { User } from '../user/entities/user.entity';
import { Company } from '../company/entities/company.entity';
import * as bcrypt from 'bcrypt';
import { StackAuthAdapter } from '../../src/auth/adapters/stack-auth.adapter';

async function seedUser() {
  let queryRunner;

  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('Conectado ao banco de dados!');
    }

    queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const app = await NestFactory.createApplicationContext(AppModule);
    const stackAuth = app.get(StackAuthAdapter);

    const userRepository = queryRunner.manager.getRepository(User);
    const companyRepository = queryRunner.manager.getRepository(Company);

    const newCompany = companyRepository.create({
      name: 'ADMIN',
      cnpj: '00000000000000',
      active: true,
      peopleForContact: 'Default Contact',
      phone: '0000000000',
      email: 'admin@parkpag.com.br',
    });
    await companyRepository.save(newCompany);

    const hashedPassword = await bcrypt.hash('123456', 10);
    const newUser = userRepository.create({
      name: 'Admin',
      lastName: 'User',
      email: 'admin@parkpag.com.br',
      password: hashedPassword,
      companyId: newCompany.id, 
      type: 'admin',
    });

    const userStackDto: CreateUserStackDto = {
      display_name: newUser.name,
      primary_email: newUser.email,
      primary_email_verified: true,
      primary_email_auth_enabled: true,
      password: '123456',
    };

    await stackAuth.createUser(userStackDto);
    await userRepository.save(newUser); 

    await queryRunner.query(
      `
      INSERT INTO public."user_companies" ("companyId", "userId", created_at, updated_at)
      VALUES ($1, $2, now(), now());
    `,
      [newCompany.id, newUser.id],
    );

    await queryRunner.commitTransaction();
    console.log('Usuário, empresa e vínculo criados com sucesso!');
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    if (queryRunner && queryRunner.isTransactionActive) {
      await queryRunner.rollbackTransaction();
      console.log('Transação revertida.');
    }
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('Conexão encerrada.');
    }
  }
}

seedUser();
