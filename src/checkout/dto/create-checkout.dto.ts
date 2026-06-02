export class CreatePaymentDto {
  items: Array<{ name: string; quantity: string; amount: number; code: string; }>;
  customer: { name: string; document: { type: string; number: string; }; email: string; phone_number: string; address: { street: string; number: string; complement?: string; neighborhood: string; city: string; state: string; zip_code: string; }; };
  shipping: { name: string; street: string; number: string; complement?: string; neighborhood: string; city: string; state: string; zip_code: string; };
  allowed_methods: string[];
  discounts?: Array<{ method: string; type: string; value: number; }>;
  callback_url: string;
}

export class CreatePaymentBodyDto {
  items: { name: string; quantity: string; amount: number; code: string; }[];
  callback_url: string;
  companyId: number;
  customer: { name: string; document: { type: string; number: string; }; email: string; phone_number: string; address: { street: string; number: string; complement?: string; neighborhood: string; city: string; state: string; zip_code: string; }; };
}
