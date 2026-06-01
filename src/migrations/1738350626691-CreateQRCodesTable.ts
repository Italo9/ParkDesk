import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateQRCodesTable1738350626691 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          CREATE TABLE IF NOT EXISTS public."QRCodes" (
            id SERIAL PRIMARY KEY,
            "internalQr" character varying NOT NULL,
            "externalQr" character varying,
            status character varying NOT NULL,
            "ticketId" bigint NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
          );
        `);

        await queryRunner.query(`
          ALTER TABLE public."QRCodes"
          ADD CONSTRAINT "fk_ticketId_QRCodes" FOREIGN KEY ("ticketId") 
          REFERENCES public."tickets"("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
          ALTER TABLE public."QRCodes"
          DROP CONSTRAINT "fk_ticketId_QRCodes";
        `);

        await queryRunner.query(`DROP TABLE IF EXISTS public."QRCodes";`);
    }

}
