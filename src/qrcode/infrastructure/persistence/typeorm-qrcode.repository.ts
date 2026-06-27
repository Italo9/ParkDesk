import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QrcodeRepository, SaveQrcodeData } from '../../domain/ports/qrcode.repository';
import { Qrcode } from '../../entities/qrcode.entity';

@Injectable()
export class TypeOrmQrcodeRepository implements QrcodeRepository {
  constructor(@InjectRepository(Qrcode) private readonly repo: Repository<Qrcode>) {}

  async save(data: SaveQrcodeData): Promise<void> {
    const entity = this.repo.create({
      internalQr: data.internalQr,
      status: data.status,
      ticketId: data.ticketId,
    });
    await this.repo.save(entity);
  }
}
