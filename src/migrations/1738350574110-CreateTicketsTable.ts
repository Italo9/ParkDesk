import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTicketsTable1738350574110 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public."tickets" (
        id BIGSERIAL  PRIMARY KEY,
        "ticketNumber" bigint NOT NULL,
        "licensePlate" character varying,
        "checkInTime" timestamp with time zone NOT NULL,
        "paymentTime" timestamp with time zone,
        "checkoutTime" timestamp with time zone,
        status character varying NOT NULL,
        "companyId" bigint NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await queryRunner.query(`
      ALTER TABLE public."tickets"
      ADD CONSTRAINT "fk_company"
      FOREIGN KEY ("companyId")
        REFERENCES public."companies"("id")
        ON DELETE CASCADE
        ON UPDATE CASCADE;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE public."tickets"
      DROP CONSTRAINT "fk_company";
    `);
    await queryRunner.query(`DROP TABLE IF EXISTS public."tickets";`);
  }
}
