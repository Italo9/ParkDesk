import { CreateUserStackDto, UpdateUserStackDto } from '../dto/users.use-case';
import { UserListAllStackAuth, UserStackAuth } from '../entities/user.entity';

export interface UsersStackAuthService {
  listUsers(team_id): Promise<UserListAllStackAuth[]>;
  createUser(createUserDto: CreateUserStackDto): Promise<UserStackAuth>;
  getUser(id: string): Promise<UserListAllStackAuth | null>;
  updateUser(id: string, updateUserDto: UpdateUserStackDto): Promise<UpdateUserStackDto>;
  deleteUser(id: string): Promise<void>;
}
