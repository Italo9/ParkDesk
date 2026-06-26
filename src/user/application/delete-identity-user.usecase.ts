import { Inject, Injectable } from '@nestjs/common';
import { IDENTITY_GATEWAY, IdentityGateway } from '../domain/ports/identity-gateway';

@Injectable()
export class DeleteIdentityUserUseCase {
  constructor(@Inject(IDENTITY_GATEWAY) private readonly identity: IdentityGateway) {}

  execute(id: string): Promise<void> {
    return this.identity.deleteUser(id);
  }
}
