export class CreateUserDto {
  name: string;
  lastName: string;
  email: string;
  password: string;
  companyId: number;
  type: string;
  token?: string;
  loggedUserEmail?: string;
}
