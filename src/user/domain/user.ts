export interface UserCompanyRef {
  id: number;
}

export class User {
  constructor(
    public readonly id: string | null,
    public readonly name: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly password: string,
    public readonly type: string,
    public readonly companies: UserCompanyRef[],
  ) {}
}

export class UserNotFound extends Error {
  constructor() {
    super('Usuario nao encontrado');
    this.name = 'UserNotFound';
  }
}

export class UserCompanyNotFound extends Error {
  constructor() {
    super('Empresa nao encontrada');
    this.name = 'UserCompanyNotFound';
  }
}

export class OperationNotAllowed extends Error {
  constructor(message = 'Operacao nao permitida') {
    super(message);
    this.name = 'OperationNotAllowed';
  }
}

export class InvalidToken extends Error {
  constructor() {
    super('Token invalido');
    this.name = 'InvalidToken';
  }
}
