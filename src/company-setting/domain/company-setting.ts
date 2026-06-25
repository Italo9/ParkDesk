export type GatewayConfig = Record<string, unknown>;

export class CompanySetting {
  constructor(
    public readonly id: number | null,
    public readonly companyId: number,
    public valueHour: number,
    public valueFractionHour: number,
    public autorecharge: boolean,
    public timeTolerance: string,
    public pixExpirationTime: number,
    public gateway: GatewayConfig | null,
  ) {}
}

export class CompanySettingNotFound extends Error {
  constructor() {
    super('Configuracao da empresa nao encontrada');
    this.name = 'CompanySettingNotFound';
  }
}

export class CompanySettingAlreadyExists extends Error {
  constructor() {
    super('Ja existe uma configuracao para esta empresa');
    this.name = 'CompanySettingAlreadyExists';
  }
}

export class CompanyNotFound extends Error {
  constructor() {
    super('Empresa nao encontrada');
    this.name = 'CompanyNotFound';
  }
}

export class OperationNotAllowed extends Error {
  constructor(message = 'Operacao nao permitida') {
    super(message);
    this.name = 'OperationNotAllowed';
  }
}
