# Estágio de build
FROM node:20-alpine AS builder

# Instalar git e dependências necessárias
RUN apk add --no-cache git python3 make g++

WORKDIR /app

# Argumentos para o repositório Git
ARG GIT_REPO
ARG GIT_BRANCH=main
ARG GIT_USERNAME
ARG GIT_PASSWORD

# Configurar credenciais do Git
RUN git config --global credential.helper store
RUN echo "https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com" > /root/.git-credentials

# Clonar o repositório
RUN git clone ${GIT_REPO} . && \
    git checkout ${GIT_BRANCH}

# Instalar dependências
RUN npm ci

# Build da aplicação
RUN npm run build

# Estágio de produção
FROM node:20-alpine

WORKDIR /app

# Copiar arquivos necessários do estágio de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/tsconfig.json ./

# Expor porta
EXPOSE 3000
