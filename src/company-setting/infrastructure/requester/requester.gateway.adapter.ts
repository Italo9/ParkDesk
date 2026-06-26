import { Injectable } from '@nestjs/common';
import { RequesterGateway, RequesterInfo } from '../../domain/ports/requester-gateway';
import { GetUserByTokenUseCase } from '../../../user/application/get-user-by-token.usecase';

@Injectable()
export class RequesterGatewayAdapter implements RequesterGateway {
  constructor(private readonly getUserByToken: GetUserByTokenUseCase) {}

  async getByToken(token: string): Promise<RequesterInfo> {
    const user = await this.getUserByToken.execute(token);
    return {
      type: user.type,
      companies: user.companies.map((c) => ({ id: c.id })),
    };
  }
}
