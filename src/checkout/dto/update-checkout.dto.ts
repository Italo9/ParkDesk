import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentDto } from './create-checkout.dto';

export class UpdateCheckoutDto extends PartialType(CreatePaymentDto) {}
