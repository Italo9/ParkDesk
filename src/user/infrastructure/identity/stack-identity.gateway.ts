import { Injectable } from '@nestjs/common';
import { CreateIdentityUser, IdentityGateway } from '../../domain/ports/identity-gateway';
import { StackAuthAdapter } from '../../../auth/adapters/stack-auth.adapter';

@Injectable()
export class StackIdentityGateway implements IdentityGateway {
  constructor(private readonly stackAuth: StackAuthAdapter) {}

  async createUser(input: CreateIdentityUser): Promise<void> {
    await this.stackAuth.createUser({
      display_name: `${input.name} ${input.lastName}`,
      primary_email: input.email,
      password: input.password,
      primary_email_verified: true,
      primary_email_auth_enabled: true,
      client_metadata: { type: input.type, companyId: input.companyId },
    });
  }

  async deleteUser(id: string): Promise<void> {
    await this.stackAuth.deleteUser(id);
  }

  async getEmailByToken(token: string): Promise<string> {
    const userData = await this.stackAuth.getUserByToken(token);
    return userData.primary_email;
  }
}
