import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanySetting } from './entities/company-setting.entity';
import { CompanySettingService } from './company-setting.service';
import { UserModule } from '../user/user.module';
import { User } from '../user/entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { CompanyModule } from '../company/company.module';
import { UserService } from '@/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([CompanySetting, User]), forwardRef(() => UserModule), forwardRef(() => AuthModule), forwardRef(() => CompanyModule)],
  providers: [CompanySettingService, UserService],
  exports: [CompanySettingService, TypeOrmModule, TypeOrmModule.forFeature([CompanySetting])],
})
export class CompanySettingModule {}
