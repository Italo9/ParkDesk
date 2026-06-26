import { User } from '../../domain/user';
import { User as UserOrm } from '../../entities/user.entity';

export class UserMapper {
  static toDomain(row: UserOrm): User {
    return new User(
      row.id,
      row.name,
      row.lastName,
      row.email,
      row.password,
      row.type,
      (row.companies ?? []).map((c) => ({ id: c.id })),
    );
  }
}
