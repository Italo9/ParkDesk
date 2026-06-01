import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddMatrizIdToCompanies1738350476515 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'companies',
      new TableColumn({
        name: 'matrizId',
        type: 'int',
        isNullable: true,
        default: null,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('companies', 'matrizId');
  }
}
