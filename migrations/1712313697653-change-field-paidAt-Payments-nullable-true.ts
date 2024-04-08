import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class ChangeFieldPaidAtPaymentsNullableTrue1712313697653 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn('Payments', 'paidAt', new TableColumn({
            name: 'paidAt',
            type: 'varchar',
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn('Payments', 'paidAt', new TableColumn({
            name: 'paidAt',
            type: 'varchar',
            isNullable: false,
        }));
    }

}
