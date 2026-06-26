import * as crypto from 'crypto';

export function generateTicketNumber(): number {
  const timestamp = Date.now().toString();
  const randomValue = Math.random().toString();
  const hash = crypto.createHash('md5').update(timestamp + randomValue).digest('hex').substring(0, 10);
  return parseInt(hash, 16);
}
