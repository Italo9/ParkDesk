import { Inject, Injectable } from '@nestjs/common';
import { MAILER_GATEWAY, MailerGateway } from '../domain/ports/mailer-gateway';

@Injectable()
export class SendWelcomeEmailUseCase {
  constructor(@Inject(MAILER_GATEWAY) private readonly mailer: MailerGateway) {}

  execute(email: string, password: string, platformLink: string): Promise<void> {
    return this.mailer.sendWelcome(email, password, platformLink);
  }
}
