import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { Company } from './entities/company.entity';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { UserService } from '@/user/user.service';
import { UserCompany } from '@/shared/entities/user-company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserCompany, Company, User]), forwardRef(() => UserModule), forwardRef(() => AuthModule)],
  controllers: [CompanyController],
  providers: [CompanyService, UserService],
  exports: [TypeOrmModule.forFeature([Company]), TypeOrmModule, CompanyService],
})
export class CompanyModule {}
