import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSessionsTable1738350509444 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public."sessions" (
        id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        token CHARACTER VARYING(1024) NOT NULL,
        email CHARACTER VARYING(512) NOT NULL,
        company BIGINT NOT NULL,
        expired TIMESTAMP WITH TIME ZONE NOT NULL,
        status BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS public."sessions";`);
  }
}
