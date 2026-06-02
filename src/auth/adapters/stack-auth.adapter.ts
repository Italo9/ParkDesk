import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from '../ports/auth-service.interface';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import * as jwkToPem from 'jwk-to-pem';
import { CreateUserStackDto, UpdateUserStackDto } from '../dto/users.use-case';
import { UserListAllStackAuth, UserStackAuth } from '../entities/user.entity';

interface StackAuthResponse { access_token: string; user: any; }
interface JwkKey { kid: string; kty: string; alg: string; use: string; n?: string; e?: string; crv?: string; x?: string; y?: string; }
interface JwksResponse { keys: JwkKey[]; }

@Injectable()
export class StackAuthAdapter implements AuthService {
  private readonly stackAuthUrl: string;
  private readonly apiKey: string;
  private readonly stackProjectId: string;

  constructor(private readonly configService: ConfigService) {
    this.stackAuthUrl = 'https://api.stack-auth.com';
    this.apiKey = this.configService.get<string>('STACK_SECRET_SERVER_KEY') as string;
    this.stackProjectId = this.configService.get<string>('NEXT_PUBLIC_STACK_PROJECT_ID') as string;
  }

  async authenticate(email: string, password: string): Promise<string> {
    try {
      const response = await axios.post<StackAuthResponse>(
        `${this.stackAuthUrl}/api/v1/auth/password/sign-in`,
        JSON.stringify({ email, password }),
        { headers: { 'Content-Type': 'application/json', 'x-stack-access-type': 'server', 'x-stack-project-id': this.stackProjectId, 'x-stack-secret-server-key': this.apiKey } },
      );
      if (response.data.access_token) return response.data.access_token;
      throw new Error('Falha ao autenticar o usuário');
    } catch (error) {
      console.error('Erro durante a autenticação: ', error);
      throw new HttpException({ statusCode: HttpStatus.UNAUTHORIZED, code: 'EMAIL_PASSWORD_MISMATCH', message: 'E-mail ou senha inválidos.' }, HttpStatus.UNAUTHORIZED);
    }
  }

  private async getPublicKey(kid: string): Promise<string | null> {
    try {
      const jwksUrl = `https://api.stack-auth.com/api/v1/projects/${this.stackProjectId}/.well-known/jwks.json`;
      const { data } = await axios.get<JwksResponse>(jwksUrl);
      const key = data.keys.find((k) => k.kid === kid);
      if (!key) { console.error('Chave pública não encontrada para o KID:', kid); return null; }
      return jwkToPem(key);
    } catch (error) {
      console.error('Erro ao buscar chave pública:', error);
      return null;
    }
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      const decodedHeader = jwt.decode(token, { complete: true }) as { header: { kid: string } };
      if (!decodedHeader || !decodedHeader.header.kid) { console.error('Token inválido: KID não encontrado'); return false; }
      const publicKey = await this.getPublicKey(decodedHeader.header.kid);
      if (!publicKey) return false;
      jwt.verify(token, publicKey, { algorithms: ['ES256'] });
      return true;
    } catch (error) {
      console.error('Falha ao validar token:', error);
      return false;
    }
  }

  async createUser(userDto: CreateUserStackDto): Promise<UserStackAuth> {
    try {
      const response = await axios.post<UserStackAuth>(`${this.stackAuthUrl}/api/v1/users`, JSON.stringify(userDto), { headers: this.getHeaders() });
      console.log('Usuário criado com sucesso:', response.data);
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response;
        if (status === 409 && data?.code === 'USER_EMAIL_ALREADY_EXISTS') {
          throw new HttpException('O e-mail informado já está cadastrado no stack-auth.', HttpStatus.CONFLICT);
        }
        throw new HttpException(data?.error || 'Erro desconhecido na criação do usuário', status);
      }
      console.error('Erro ao criar usuário:', error);
      throw new HttpException('Erro inesperado ao criar usuário.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async listUsers(): Promise<any[]> {
    try {
      const response = await axios.get(`${this.stackAuthUrl}/api/v1/users`, { headers: { 'x-stack-access-type': 'server', 'x-stack-project-id': this.stackProjectId, 'x-stack-secret-server-key': this.apiKey } });
      return response.data.items || [];
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      throw new Error('Erro ao listar usuários');
    }
  }

  async getUserByToken(token: string): Promise<any> {
    try {
      const response = await axios.get(`${this.stackAuthUrl}/api/v1/users/me`, { headers: { 'x-stack-access-type': 'server', 'x-stack-project-id': this.stackProjectId, 'x-stack-secret-server-key': this.apiKey, 'X-Stack-Access-Token': token, Authorization: `Bearer ${token}` } });
      return response.data;
    } catch (error) {
      throw new Error('Erro ao obter usuário');
    }
  }

  async getUserById(userId: string): Promise<UserListAllStackAuth> {
    try {
      const response = await axios.get(`${this.stackAuthUrl}/api/v1/users/${userId}`, { headers: { 'x-stack-access-type': 'server', 'x-stack-project-id': this.stackProjectId, 'x-stack-secret-server-key': this.apiKey } });
      return response.data;
    } catch (error) {
      console.error(`Erro ao obter usuário ${userId}:`, error);
      throw new Error('Erro ao obter usuário');
    }
  }

  async updateUser(userId: string, userDto: UpdateUserStackDto): Promise<UpdateUserStackDto> {
    try {
      const response = await axios.patch(`${this.stackAuthUrl}/api/v1/users/${userId}`, userDto, { headers: this.getHeaders() });
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar usuário ${userId}:`, error);
      throw new Error('Erro ao atualizar usuário');
    }
  }

  async deleteUser(email: string): Promise<void> {
    try {
      const users = await this.listUsers();
      const user = users.find((u) => u.id === email);
      if (!user) throw new Error('Usuário não encontrado');
      await axios.delete(`${this.stackAuthUrl}/api/v1/users/${user.id}`, { headers: this.getHeaders() });
    } catch (error) {
      console.error(`Erro ao excluir usuário ${email}:`, error);
      throw new Error('Erro ao excluir usuário');
    }
  }

  private getHeaders() {
    return { 'Content-Type': 'application/json', 'x-stack-access-type': 'server', 'x-stack-project-id': this.stackProjectId, 'x-stack-secret-server-key': this.apiKey };
  }
}
