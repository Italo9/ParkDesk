export class ApiKey {
  constructor(
    public readonly id: number | null,
    public apiKey: string,
    public readonly name: string,
    public readonly description: string,
    public readonly companyId: number | null,
    public readonly userId: string | null,
    public readonly expirationDate: Date | null,
    public isActive: boolean,
  ) {}

  isExpired(): boolean {
    if (!this.expirationDate) return false;
    return new Date() > this.expirationDate;
  }
}

export class ApiKeyNotFound extends Error {
  constructor() {
    super('API Key nao encontrada');
    this.name = 'ApiKeyNotFound';
  }
}

export class CompanyNotFound extends Error {
  constructor() {
    super('Empresa nao encontrada');
    this.name = 'CompanyNotFound';
  }
}

export class InvalidExpirationDate extends Error {
  constructor() {
    super('Data de expiracao invalida');
    this.name = 'InvalidExpirationDate';
  }
}
