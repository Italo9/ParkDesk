export const MAILER_GATEWAY = Symbol('USER_MAILER_GATEWAY');

export interface MailerGateway {
  sendWelcome(email: string, password: string, platformLink: string): Promise<void>;
}
