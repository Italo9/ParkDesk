export class CreateApiKeyRequestDto {
  readonly token?: string;
  readonly expirationDate?: string;
  readonly name: string;
  readonly isActive: boolean;
  readonly description: string;
  readonly companyId: number;

  constructor(token: string, name: string, isActive: boolean, description: string, companyId: number, expirationDate?: string) {
    this.token = token;
    this.name = name;
    this.isActive = isActive;
    this.description = description;
    this.companyId = companyId;
    this.expirationDate = expirationDate;
  }
}
