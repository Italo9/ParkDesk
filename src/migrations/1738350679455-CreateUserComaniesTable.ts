import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserCompaniesTable1738350679455 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public."user_companies" (
        id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, 
        "companyId" bigint NOT NULL,
        "userId" bigint NOT NULL,
        created_at timestamp with time zone NOT NULL DEFAULT now(),
        updated_at timestamp with time zone NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      ALTER TABLE public."user_companies"
      ADD CONSTRAINT "fk_companyId" FOREIGN KEY ("companyId")
      REFERENCES public."companies"("id")
      ON DELETE CASCADE
      ON UPDATE CASCADE;
    `);

    await queryRunner.query(`
      ALTER TABLE public."user_companies"
      ADD CONSTRAINT "fk_userId" FOREIGN KEY ("userId")
      REFERENCES public."users"("id")
      ON DELETE CASCADE
      ON UPDATE CASCADE;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS public."user_companies";`);
  }
}
