import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePaymentsTable1738350607309 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          CREATE TABLE IF NOT EXISTS public."payments" (
            id BIGSERIAL PRIMARY KEY,
            "paymentMethod" character varying(50) NOT NULL,
            value double precision NOT NULL,
            repayment boolean,
            "paymentDate" timestamp with time zone NOT NULL,
            "checkoutId" bigint NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
          );
        `);

        await queryRunner.query(`
          ALTER TABLE public."payments"
          ADD CONSTRAINT "fk_checkoutId_payments" FOREIGN KEY ("checkoutId") 
          REFERENCES public."checkouts"("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE;
        `);
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
          ALTER TABLE public."payments"
          DROP CONSTRAINT "fk_checkoutId_payments";
        `);

        await queryRunner.query(`DROP TABLE IF EXISTS public."payments";`);
      }
}
