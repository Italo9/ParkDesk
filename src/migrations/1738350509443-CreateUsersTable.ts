import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1738350509443 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public."users" (
        id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, 
        name character varying(255) NOT NULL,
        "lastName" character varying(255),
        email character varying(255) NOT NULL UNIQUE,
        password character varying(255) NOT NULL,
        "type" character varying(255) NOT NULL, 
        created_at timestamp with time zone NOT NULL DEFAULT now(),
        updated_at timestamp with time zone NOT NULL DEFAULT now()
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS public."users";`);
  }
}
