export class CreateApiKeyResponseDto {
  readonly apiKey: string;
  readonly expirationDate?: Date | undefined;

  constructor(apiKey: string, expirationDate?: Date) {
    this.apiKey = apiKey;
    this.expirationDate = expirationDate;
  }
}
