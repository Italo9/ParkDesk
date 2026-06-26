import { Company } from '../../domain/company';
import { Company as CompanyOrm } from '../../entities/company.entity';

export class CompanyMapper {
  static toDomain(row: CompanyOrm): Company {
    return new Company(
      row.id,
      row.name,
      row.cnpj,
      row.active,
      row.peopleForContact,
      row.phone,
      row.email,
      row.matrizId,
      (row.users ?? []).map((u) => ({ id: u.id, email: u.email })),
    );
  }
}
