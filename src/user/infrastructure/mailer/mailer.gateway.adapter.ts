import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { MailerGateway } from '../../domain/ports/mailer-gateway';

@Injectable()
export class MailerGatewayAdapter implements MailerGateway {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcome(email: string, password: string, platformLink: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Seja bem vindo!',
      template: 'welcome',
      context: { user: email, password, platformLink },
    });
  }
}
