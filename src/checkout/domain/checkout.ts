export class Checkout {
  constructor(
    public readonly id: number,
    public readonly url: string,
    public readonly valor: number | null,
    public readonly status: string,
    public readonly ticketId: number | null,
  ) {}
}

export interface PaycoCheckoutResult {
  id: string;
  created_at: string;
}

export interface PaycoPixPaymentMethod {
  qr_code: string;
  final_amount: number;
  status: string;
}

export interface PaycoPixResult {
  payment_methods: { pix: PaycoPixPaymentMethod };
}

export class CheckoutNotFound extends Error {
  constructor(id: number) {
    super(`Checkout com ID ${id} nao encontrado`);
    this.name = 'CheckoutNotFound';
  }
}

export class PaymentAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PaymentAuthError';
  }
}

export class PaymentGatewayError extends Error {
  constructor() {
    super('Erro no gateway de pagamento.');
    this.name = 'PaymentGatewayError';
  }
}
