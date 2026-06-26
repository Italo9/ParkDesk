export interface CompanyUserRef {
  id: string;
  email: string;
}

export class Company {
  constructor(
    public readonly id: number | null,
    public readonly name: string,
    public readonly cnpj: string,
    public readonly active: boolean,
    public readonly peopleForContact: string | undefined,
    public readonly phone: string | undefined,
    public readonly email: string | undefined,
    public readonly matrizId: number | undefined,
    public readonly users: CompanyUserRef[],
  ) {}
}

export class CompanyNotFound extends Error {
  constructor(id?: number | string) {
    super(id !== undefined ? `Empresa com ID ${id} nao encontrada.` : 'Empresa nao encontrada');
    this.name = 'CompanyNotFound';
  }
}

export class CompanyEmailAlreadyExists extends Error {
  constructor() {
    super('Ja existe uma empresa cadastrada com este e-mail.');
    this.name = 'CompanyEmailAlreadyExists';
  }
}

export class CompanyCnpjAlreadyExists extends Error {
  constructor() {
    super('Ja existe uma empresa cadastrada com este CNPJ.');
    this.name = 'CompanyCnpjAlreadyExists';
  }
}

export class OperationNotAllowed extends Error {
  constructor(message = 'Operacao nao permitida') {
    super(message);
    this.name = 'OperationNotAllowed';
  }
}

export class CompanyTypeRequired extends Error {
  constructor() {
    super('O campo "type" e obrigatorio e nao pode ser nulo.');
    this.name = 'CompanyTypeRequired';
  }
}

export class CompanyAssociationError extends Error {
  constructor() {
    super('Erro ao associar usuario a empresa');
    this.name = 'CompanyAssociationError';
  }
}

export class CompanyCreateError extends Error {
  constructor() {
    super('Erro ao criar empresa.');
    this.name = 'CompanyCreateError';
  }
}
