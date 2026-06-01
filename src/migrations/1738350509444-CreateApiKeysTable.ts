import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateApiKeysTable1738350512345 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE public."api_keys" (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        api_key VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        description VARCHAR(255),
        "companyId" BIGINT,
        user_id BIGINT,
        expiration_date TIMESTAMP,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      );
    `);

    await queryRunner.query(`
      ALTER TABLE public."api_keys"
      ADD CONSTRAINT fk_company FOREIGN KEY ("companyId")
      REFERENCES public."companies"(id)
      ON DELETE SET NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS public."api_keys";
    `);
  }
}
