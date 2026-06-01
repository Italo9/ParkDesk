#!/bin/sh
set -e

# Função para verificar se o banco de dados está pronto
wait_for_db() {
    echo "Aguardando o banco de dados..."
    while ! nc -z $DB_HOST $DB_PORT; do
        sleep 1
    done
    echo "Banco de dados está pronto!"
}

# Instalar netcat para verificar a conexão com o banco
apk add --no-cache netcat-openbsd

# Aguardar o banco de dados estar pronto
wait_for_db

# Executar migrations
echo "Executando migrations..."
npm run migration:run

# Executar seed
echo "Executando seed..."
npm run seed

# Executar o comando passado para o container
exec "$@"
