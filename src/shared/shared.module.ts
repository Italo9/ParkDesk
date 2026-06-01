import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCompany } from './entities/user-company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserCompany])],
  exports: [TypeOrmModule],
})
export class SharedModule {}
