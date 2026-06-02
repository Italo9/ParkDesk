import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Company } from '../../company/entities/company.entity';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar', length: 512 })
  token: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column({ type: 'timestamp', name: 'expired' })
  expiredAt: Date;

  @ManyToOne(() => Company, (company) => company.sessions, { nullable: false })
  @JoinColumn({ name: 'company' })
  company: Company;
}
