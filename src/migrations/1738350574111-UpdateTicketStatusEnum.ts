import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTicketStatusEnum1738350574111 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE public."ticket_status_enum" AS ENUM ('open', 'paid', 'closed')
    `);

    await queryRunner.query(`
      ALTER TABLE public."tickets"
      ADD COLUMN status_temp public."ticket_status_enum"
    `);

    await queryRunner.query(`
      UPDATE public."tickets"
      SET status_temp = CASE
        WHEN status = 'active' THEN 'open'::public."ticket_status_enum"
        WHEN status = 'paid' THEN 'paid'::public."ticket_status_enum"
        WHEN status = 'closed' THEN 'closed'::public."ticket_status_enum"
        ELSE 'open'::public."ticket_status_enum"
      END
    `);

    await queryRunner.query(`
      ALTER TABLE public."tickets"
      DROP COLUMN status
    `);

    await queryRunner.query(`
      ALTER TABLE public."tickets"
      RENAME COLUMN status_temp TO status
    `);

    await queryRunner.query(`
      ALTER TABLE public."tickets"
      ALTER COLUMN status SET DEFAULT 'open'::public."ticket_status_enum"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE public."tickets"
      ADD COLUMN status_temp varchar
    `);

    await queryRunner.query(`
      UPDATE public."tickets"
      SET status_temp = status::varchar
    `);

    await queryRunner.query(`
      ALTER TABLE public."tickets"
      DROP COLUMN status
    `);

    await queryRunner.query(`
      ALTER TABLE public."tickets"
      RENAME COLUMN status_temp TO status
    `);

    await queryRunner.query(`
      DROP TYPE public."ticket_status_enum"
    `);
  }
}
