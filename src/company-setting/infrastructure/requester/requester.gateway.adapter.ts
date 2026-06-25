import { Injectable } from '@nestjs/common';
import { RequesterGateway, RequesterInfo } from '../../domain/ports/requester-gateway';
import { UserService } from '../../../user/user.service';

@Injectable()
export class RequesterGatewayAdapter implements RequesterGateway {
  constructor(private readonly userService: UserService) {}

  async getByToken(token: string): Promise<RequesterInfo> {
    const user = (await this.userService.getUserByToken(token)) as {
      type: string;
      companies?: { id: number }[];
    };
    return {
      type: user.type,
      companies: (user.companies ?? []).map((c) => ({ id: c.id })),
    };
  }
}
