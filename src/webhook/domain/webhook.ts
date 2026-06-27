export class WebhookProcessingError extends Error {
  constructor() {
    super('Erro ao processar o webhook de pagamento');
    this.name = 'WebhookProcessingError';
  }
}
