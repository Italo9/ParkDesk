import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCompanySettingsTable1738350662589 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public.company_settings (
        id SERIAL PRIMARY KEY,
        "ValueHour" double precision NOT NULL,
        "ValueFractionHour" double precision NOT NULL,
        autoRecharge boolean NOT NULL,
        "timeTolerance" time without time zone NOT NULL,
        "pixExpirationTime" integer NOT NULL,
        gateway jsonb,
        "companyId" bigint NOT NULL,
        created_at timestamp with time zone DEFAULT now() NOT NULL,
        updated_at timestamp with time zone DEFAULT now() NOT NULL
      );
    `);

    await queryRunner.query(`
      ALTER TABLE public.company_settings
      ADD CONSTRAINT fk_company
      FOREIGN KEY ("companyId")
      REFERENCES public.companies(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS public.company_settings;`);
  }
}
