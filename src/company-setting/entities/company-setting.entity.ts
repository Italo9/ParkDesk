import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Company } from './../../company/entities/company.entity';

@Entity('company_settings')
export class CompanySetting {
  @PrimaryGeneratedColumn('increment') id: number;
  @Column({ type: 'double precision' }) ValueHour: number;
  @Column({ type: 'double precision' }) ValueFractionHour: number;
  @Column() autorecharge: boolean;
  @Column({ type: 'time' }) timeTolerance: string;
  @Column({ type: 'integer' }) pixExpirationTime: number;
  @Column({ type: 'jsonb', nullable: true }) gateway: object;
  @ManyToOne(() => Company, (company) => company.companySetting, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'companyId' }) company: Company;
  @CreateDateColumn({ type: 'timestamptz' }) created_at: Date;
  @UpdateDateColumn({ type: 'timestamptz' }) updated_at: Date;
}
