# ParkPag - Sistema de Pagamento de Estacionamento

## Requisitos

- Node.js 20.x
- Docker e Docker Compose
- PostgreSQL
- Conta no Stack Auth

## Configuração Inicial

### 1. Stack Auth
1. Acesse [Stack Auth](https://stackauth.com)
2. Crie uma nova conta
3. Crie um novo projeto
4. Copie as credenciais:
   - Project ID
   - Publishable Client Key
   - Secret Server Key

### 2. Configuração do Ambiente

#### Arquivo .env
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Configurações do Git (para Portainer)
GIT_REPO=https://github.com/seu-usuario/seu-repositorio.git
GIT_BRANCH=main
GIT_USERNAME=seu-usuario
GIT_PASSWORD=seu-token-ou-senha

# Configurações do Banco de Dados
DB_USERNAME=postgres
DB_PASSWORD=root
DB_DATABASE=ParkPag_3

# Configurações da Stack Auth
NEXT_PUBLIC_STACK_PROJECT_ID=seu-project-id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=sua-client-key
STACK_SECRET_SERVER_KEY=sua-server-key

# URLs da Aplicação
QR_CODE_BASE_URL=https://parkpag.levantti.com.br/pre-checkout
PAYCO_WEBHOOK_URL=https://parkpag.levantti.com.br/payment/webhook/11

# Configurações do Payco
PAYCO_AUTH_URL=https://sso.payments.payco.com.br/realms/payco-payments/protocol/openid-connect/token
PAYCO_CLIENT_ID=seu-client-id
PAYCO_CLIENT_SECRET=seu-client-secret

# Configurações do SMTP
SMTP_HOST=seu-smtp-host
SMTP_PORT=2525
SMTP_USER=seu-smtp-user
SMTP_PASS=seu-smtp-password
```

## Execução Local

### 1. Instalação de Dependências
```bash
npm install
```

### 2. Configuração do Banco de Dados
1. Crie o banco de dados:
```bash
# Acesse o PostgreSQL
psql -U postgres

# Crie o banco de dados
CREATE DATABASE "ParkPag_3";
```

### 3. Execução das Migrations e Seed
```bash
# Executar migrations
npm run migration:run

# Executar seed para criar dados iniciais
npm run seed
```

### 4. Modo de Desenvolvimento
```bash
npm run start:dev
```

### 5. Build do Projeto
```bash
npm run build
```

### 6. Modo de Produção
```bash
npm run start:prod
```

## Documentação da API

Com a aplicação rodando, o Swagger fica disponível em `/api/docs`.

## Execução com Docker

### 1. Ambiente de Desenvolvimento
```bash
docker-compose -f docker-compose.local.yml up --build
docker-compose -f docker-compose.local.yml down
```

### 2. Ambiente de Produção (Portainer)

1. Crie a rede: `docker network create park-pag-network`
2. No Portainer, crie uma Stack apontando para o repositório Git e a branch.
3. Configure todas as variáveis do `.env` no Portainer.
4. Faça o deploy da stack.
5. Rode migrations e seed dentro do container.

## Troubleshooting

- Erro de conexão com o banco: confirme se o PostgreSQL está rodando e se as credenciais do `.env` estão corretas.
- Erro nas migrations: confirme se o banco existe e foi criado.
- Erro no build: confirme o Node 20, limpe o cache (`npm cache clean --force`) e reinstale as dependências.
