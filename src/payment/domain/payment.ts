export interface DifferentialResult {
  qrCode: string;
  message: string;
}

export class TicketNotFoundOrPaid extends Error {
  constructor() {
    super('Ticket nao encontrado ou ja PAID');
    this.name = 'TicketNotFoundOrPaid';
  }
}

export class DifferentialNotAvailable extends Error {
  constructor() {
    super('Pagamento diferencial nao esta disponivel');
    this.name = 'DifferentialNotAvailable';
  }
}

export class ToleranceNotExceeded extends Error {
  constructor() {
    super('Tempo de tolerancia nao foi excedido');
    this.name = 'ToleranceNotExceeded';
  }
}

export class TicketNotFound extends Error {
  constructor() {
    super('Ticket nao encontrado');
    this.name = 'TicketNotFound';
  }
}
