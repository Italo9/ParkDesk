export const API_KEY_CIPHER = Symbol('API_KEY_CIPHER');

export interface GeneratedApiKey {
  encryptedApiKey: string;
  expiresAt?: string;
}

export interface ApiKeyCipher {
  generateApiKey(expirationDate?: Date): GeneratedApiKey;
}
