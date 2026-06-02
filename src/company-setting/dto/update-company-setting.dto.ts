import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateCompanySettingDto } from './create-company-setting.dto';

export class UpdateCompanySettingDto extends OmitType(PartialType(CreateCompanySettingDto), ['companyId'] as const) {}
