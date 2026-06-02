import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Company } from './../../company/entities/company.entity';
import { ApiKey } from '../../api_key/entities/api-key.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255, nullable: true })
  lastName: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 255 })
  password: string;

  @ManyToMany(() => Company, (company) => company.users)
  @JoinTable({ name: 'user_companies', joinColumn: { name: 'userId', referencedColumnName: 'id' }, inverseJoinColumn: { name: 'companyId', referencedColumnName: 'id' } })
  companies: Company[];

  @OneToMany(() => ApiKey, (apiKey) => apiKey.user)
  apiKeys: ApiKey[];

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @Column({ length: 255 })
  type: string;
}
