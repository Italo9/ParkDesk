export interface AuthService {
  authenticate(username: string, password: string): Promise<string>;
  validateToken(token: string): Promise<boolean>;
}
