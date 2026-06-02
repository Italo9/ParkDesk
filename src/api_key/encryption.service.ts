import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly secretKey = crypto.createHash('sha256').update('super_seguro').digest('base64').substr(0, 32);
  private readonly ivLength = 16;

  generateApiKey(expirationDate?: Date): { encryptedApiKey: string; expiresAt?: string } {
    const apiKey = crypto.randomBytes(32).toString('hex');
    const encryptedApiKey = this.encrypt(apiKey);
    return expirationDate ? { encryptedApiKey, expiresAt: expirationDate.toISOString() } : { encryptedApiKey };
  }

  private encrypt(text: string): string {
    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(this.secretKey), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  decryptApiKey(encryptedText: string): string {
    const [ivHex, encrypted] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(this.secretKey), iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
