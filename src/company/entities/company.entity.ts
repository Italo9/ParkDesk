import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne, Unique, ManyToMany } from 'typeorm';
import { User } from './../../user/entities/user.entity';
import { Session } from '../../auth/entities/session.entity';
import { Ticket } from '../../ticket/entities/ticket.entity';
import { CompanySetting } from '../../company-setting/entities/company-setting.entity';

@Entity('companies')
@Unique(['cnpj'])
export class Company {
  @PrimaryGeneratedColumn('increment') id: number;
  @Column({ length: 255 }) name: string;
  @Column({ length: 14, unique: true }) cnpj: string;
  @Column({ type: 'boolean' }) active: boolean;
  @Column({ length: 255, nullable: true, name: 'peopleForContact' }) peopleForContact?: string;
  @Column({ nullable: true }) phone?: string;
  @Column({ nullable: true }) email?: string;
  @Column({ type: 'int', nullable: true }) matrizId?: number;
  @ManyToMany(() => User, (user) => user.companies) users: User[];
  @OneToMany(() => Session, (session) => session.company, { cascade: ['remove'], onDelete: 'CASCADE' }) sessions: Session[];
  @OneToOne(() => CompanySetting, (companySetting) => companySetting.company, { cascade: true }) companySetting: CompanySetting;
  @OneToMany(() => Ticket, (ticket) => ticket.company) tickets: Ticket[];
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) created_at: Date;
  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) updated_at: Date;
}
