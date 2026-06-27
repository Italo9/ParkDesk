export const API_KEY_GATEWAY = Symbol('CHECKOUT_API_KEY_GATEWAY');

export interface ApiKeyGateway {
  companyIdFor(apiKey: string): Promise<number | null>;
}
