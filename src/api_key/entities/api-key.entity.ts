import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Company } from '../../company/entities/company.entity';
import { User } from '../../user/entities/user.entity';

@Entity('api_keys')
export class ApiKey {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'api_key', unique: true })
  apiKey: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @ManyToOne(() => Company, (company) => company.id, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @ManyToOne(() => User, (user) => user.apiKeys, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'expiration_date', type: 'timestamp', nullable: true })
  expirationDate?: Date;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  isExpired(): boolean {
    if (!this.expirationDate) return false;
    return new Date() > this.expirationDate;
  }
}
