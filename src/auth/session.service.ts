import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './entities/session.entity';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
  ) {}

  async create(sessionData: Partial<Session>): Promise<Session> {
    await this.sessionRepository.update(
      { email: sessionData.email, status: true },
      { status: false },
    );
    const newSession = this.sessionRepository.create(sessionData);
    return this.sessionRepository.save(newSession);
  }

  async findByToken(token: string): Promise<Session | null> {
    return this.sessionRepository.findOne({ where: { token } });
  }

  async findByEmail(email: string): Promise<Session | null> {
    return this.sessionRepository.findOne({ where: { email } });
  }

  async updateStatus(sessionId: string, status: boolean): Promise<void> {
    await this.sessionRepository.update(sessionId, { status });
  }

  async saveExpiredDate(email: string, expiredAt: Date): Promise<void> {
    await this.sessionRepository.update({ email }, { expiredAt });
  }
}
