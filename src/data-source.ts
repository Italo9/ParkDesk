import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config(); // Carrega as variáveis de ambiente do .env

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_DATABASE || 'ParkPag_3',
  synchronize: false, // Nunca defina como true em produção
  migrationsTableName: 'migrations',
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
});
