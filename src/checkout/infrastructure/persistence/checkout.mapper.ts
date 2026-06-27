import { Checkout } from '../../domain/checkout';
import { Checkout as CheckoutOrm } from '../../entities/checkout.entity';

export class CheckoutMapper {
  static toDomain(row: CheckoutOrm): Checkout {
    return new Checkout(row.id, row.url, row.valor ?? null, row.status, row.ticket?.id ?? null);
  }
}
